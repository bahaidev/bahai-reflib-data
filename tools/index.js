import {readFile, writeFile, mkdir} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import fetch from 'node-fetch';
import JSDOM from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
const worksToUrls = JSON.parse(
  await readFile(join(__dirname, 'data', 'works-to-urls.json'))
);

await Promise.all(worksToUrls.content.map(async ({url, title}) => {
  const resp = await fetch(url);

  const html = await resp.text();
  // console.log('html', html);

  const {document} = new JSDOM.JSDOM(html).window;

  // const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // There are some titles that match but they don't have pnum content, so
  //   restrict to those within paragraphs
  // <a class="brl-pnum">9</a> <a id="282442314" class="brl-location"></a>
  const idElems = $$('p > a.brl-pnum + a.brl-location');

  const output = idElems.reduce((obj, idElem) => {
    obj[idElem.id] = Number.parseInt(
      idElem.previousElementSibling.textContent.trim()
    );
    return obj;
  }, {});

  const keysValuesFlip = (obj) => {
    return Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
  };

  const dir = join(__dirname, 'data', title);
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
