/* eslint no-shadow: ["error", {allow: ["$$", "parentUrl"]}] --
  Reuse for convenience */
import {readFile, mkdir} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {getDomForUrl} from './fetchDom.js';
import {keysValuesFlip, writeJSONFile} from './jsUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/data');
const doubleAngleQuotes = /»/gu;

const setSiblingId = (obj, idElem) => {
  const number = Number.parseInt(
    idElem.previousElementSibling.textContent.trim()
  );
  if (Number.isNaN(number)) {
    return obj;
  }
  obj[idElem.id] = number;
  return obj;
};

(async () => {
const parentUrl = 'https://www.bahai.org/library/';
const {$$} = await getDomForUrl(parentUrl);

const mainCollections = $$('h4 a, h5 a').filter((a) => {
  return !a.textContent.includes('Help and Information');
}).map((a) => {
  return {
    parentUrl,
    url: a.href,
    title: a.textContent.replace(doubleAngleQuotes, '').trim()
  };
});

await writeJSONFile(join(dataDir, 'mainCollections.json'), mainCollections);

const collections = (await Promise.all(mainCollections.map(
  async ({url: parentUrl}) => {
    const {$$} = await getDomForUrl(parentUrl);

    return $$('.topic-collection-content h2 a').map((a) => {
      return {
        parentUrl,
        url: a.href,
        title: a.textContent.replace(doubleAngleQuotes, '').trim()
      };
    });
  }
))).flat();

await writeJSONFile(join(dataDir, 'collections.json'), collections);

const works = (await Promise.all(collections.map(
  async ({url: parentUrl}) => {
    const {$$} = await getDomForUrl(parentUrl);

    return $$('.topic-collection-content h4 a').map((a) => {
      return {
        parentUrl,
        url: a.href,
        title: a.textContent.replace(doubleAngleQuotes, '').trim()
      };
    });
  }
))).flat();

await writeJSONFile(join(dataDir, 'works.json'), works);

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
