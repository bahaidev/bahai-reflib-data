/* eslint no-shadow: ["error", {allow: ["$$", "parentUrl"]}] --
  Reuse for convenience */
import {readFile, mkdir} from 'fs/promises';
import {join} from 'path';
import {getDomForUrl} from './fetchDom.js';
import {keysValuesFlip, writeJSONFile} from './jsUtils.js';
import {
  downloadAndSaveMainCollections, downloadAndSaveCollections,
  downloadAndSaveWorks, downloadAndSaveSections
} from './downloadAndSave.js';

import {
  getMainCollections, getCollections,
  getWorks, getSections
} from './getData.js';

import {dataDir} from './pathInfo.js';

const setSiblingId = (obj, idElem) => {
  const paragraphNumber = Number.parseInt(
    idElem.previousElementSibling.textContent.trim()
  );
  if (Number.isNaN(paragraphNumber)) {
    return obj;
  }
  obj[idElem.id] = paragraphNumber;
  return obj;
};

(async () => {
const mainCollections = process.argv.includes('mainCollections')
  ? await downloadAndSaveMainCollections()
  : await getMainCollections();

const collections = process.argv.includes('collections')
  ? await downloadAndSaveCollections(mainCollections)
  : await getCollections();

const works = process.argv.includes('works')
  ? await downloadAndSaveWorks(collections)
  : await getWorks();

/* const sections = */ process.argv.includes('sections')
  ? await downloadAndSaveSections(works)
  : await getSections();

const worksToUrls = JSON.parse(
  await readFile(join(dataDir, 'works-to-urls.json'))
);

await Promise.all(worksToUrls.content.map(async ({url, title}) => {
  const {$$} = await getDomForUrl(url);
  // console.log('html', html);

  // There are some titles that match but they don't have pnum content, so
  //   restrict to those within paragraphs
  // <a class="brl-pnum">9</a> <a id="282442314" class="brl-location"></a>
  const idElems = $$('p > a.brl-pnum + a.brl-location');

  const output = idElems.reduce((obj, idElem) => {
    return setSiblingId(obj, idElem);
  }, {});

  const titleDir = join(dataDir, title);
  await mkdir(titleDir, {recursive: true});

  await Promise.all([
    writeJSONFile(
      join(titleDir, 'ids-to-paragraphs.json'), output
    ),
    writeJSONFile(
      join(titleDir, 'paragraphs-to-ids.json'), keysValuesFlip(output)
    )
  ]);
}));
})();
