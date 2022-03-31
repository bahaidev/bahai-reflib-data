import {readFile, writeFile, mkdir} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {getDomForUrl} from './fetchDom.js';
import {keysValuesFlip} from './jsUtils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
// await getDomForUrl('https://www.bahai.org/library/');

const worksToUrls = JSON.parse(
  await readFile(join(__dirname, '../src/data', 'works-to-urls.json'))
);

await Promise.all(worksToUrls.content.map(async ({url, title}) => {
  const {$$} = await getDomForUrl(url);
  // console.log('html', html);

  // There are some titles that match but they don't have pnum content, so
  //   restrict to those within paragraphs
  // <a class="brl-pnum">9</a> <a id="282442314" class="brl-location"></a>
  const idElems = $$('p > a.brl-pnum + a.brl-location');

  const output = idElems.reduce((obj, idElem) => {
    const number = Number.parseInt(
      idElem.previousElementSibling.textContent.trim()
    );
    if (Number.isNaN(number)) {
      return obj;
    }
    obj[idElem.id] = number;
    return obj;
  }, {});

  const dir = join(__dirname, '../src/data', title);
  await mkdir(dir, {recursive: true});

  await Promise.all([
    writeFile(
      join(dir, 'ids-to-paragraphs.json'),
      JSON.stringify(output, null, 2)
    ),
    writeFile(
      join(dir, 'paragraphs-to-ids.json'),
      JSON.stringify(keysValuesFlip(output), null, 2)
    )
  ]);
}));
})();
