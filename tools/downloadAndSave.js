import {join} from 'path';

import {getDomForUrl} from './fetchDom.js';
import {writeJSONFile} from './jsUtils.js';
import {dataDir} from './pathInfo.js';

const doubleAngleQuotes = /»/gu;
const idFind = /^.*#(?<id>\d+)$/u;
const idReplace = '$<id>';

/**
* @typedef {{
*   parentUrl: string,
*   url: string,
*   title: string
* }} Collection
*/

/**
* @typedef {Collection} MainCollection
*/

/**
 * @returns {Promise<MainCollection[]>}
 */
async function downloadAndSaveMainCollections () {
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

  return mainCollections;
}

/**
 * @param {MainCollection[]} mainCollections
 * @returns {Promise<Collection[]>}
 */
async function downloadAndSaveCollections (mainCollections) {
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

  return collections;
}

/**
* @typedef {Collection} Work
*/

/**
 * @param {Collection[]} collections
 * @returns {Work[]}
 */
async function downloadAndSaveWorks (collections) {
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

  return works;
}

/**
* @typedef {{mainSections: Collection[], subSections: Collection[]}} Work
*/

/**
 * @param {Work[]} works
 * @returns {Section[]}
 */
async function downloadAndSaveSections (works) {
  const sections = (await Promise.all(works.map(
    async ({url: parentUrl}) => {
      const {$$} = await getDomForUrl(parentUrl);

      const mainSections = $$(
        '.publication-page-contents h1 a[href]'
      ).map((a) => {
        return {
          parentUrl,
          url: a.href,
          title: a.textContent.replace(doubleAngleQuotes, '').trim()
        };
      });

      const subSections = $$(
        '.publication-page-contents li a[href]'
      ).map((a) => {
        return {
          parentUrl,
          id: a.href.replace(idFind, idReplace),
          url: a.href,
          title: a.textContent.replace(doubleAngleQuotes, '').trim()
        };
      });

      return {
        mainSections,
        subSections
      };
    }
  ))).reduce((obj, {mainSections, subSections}) => {
    obj.mainSections.push(...mainSections);
    obj.subSections.push(...subSections);
    return obj;
  }, {
    mainSections: [],
    subSections: []
  });

  await Promise.all(sections.mainSections.map(async (mainSection) => {
    const {url} = mainSection;
    const {$} = await getDomForUrl(url);
    mainSection.id = $('.brl-tableofcontents h1 > a').href.replace(
      idFind, idReplace
    );
  }));

  await writeJSONFile(join(dataDir, 'sections.json'), sections);

  return sections;
}

export {
  downloadAndSaveMainCollections, downloadAndSaveCollections,
  downloadAndSaveWorks, downloadAndSaveSections
};
