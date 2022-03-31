import {join} from 'path';

import PromiseThrottle from 'promise-throttle';

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

  // eslint-disable-next-line no-console -- Logging
  console.log('Processed main URL for main collections', parentUrl);

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
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 1
  });

  const collections = (await Promise.all(
    mainCollections.map(({url: parentUrl}) => {
      return promiseThrottle.add(async () => {
        const {$$} = await getDomForUrl(parentUrl);

        // eslint-disable-next-line no-console -- Logging
        console.log('Processed main collection URL for collections', parentUrl);

        return $$('.topic-collection-content h2 a').map((a) => {
          return {
            parentUrl,
            url: a.href,
            title: a.textContent.replace(doubleAngleQuotes, '').trim()
          };
        });
      });
    })
  )).flat();

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
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 1
  });

  const works = (await Promise.all(collections.map(({url: parentUrl}) => {
    return promiseThrottle.add(async () => {
      const {$$} = await getDomForUrl(parentUrl);

      // eslint-disable-next-line no-console -- Logging
      console.log('Processed collection URL for works', parentUrl);

      return $$('.topic-collection-content h4 a').map((a) => {
        return {
          parentUrl,
          url: a.href,
          title: a.textContent.replace(doubleAngleQuotes, '').trim()
        };
      });
    });
  }))).flat();

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
  // There are many, many more total sections so we at least need to throttle
  //   this (though we probably should throttle all)
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 1
  });

  // NOTE: There is some redundancy here; we could cache URL for results, as
  //  some works are duplicates in terms of being repeated in another
  //  collection (we keep them as separate sections though as they have
  //  different meta-data due to having different parents).

  const sections = (await Promise.all(works.map(({url: parentUrl}) => {
    // Avoid preprocessing items like Promise of World Peace which, though being
    //   independent works, show up on a page with already processed messages;
    //   the anchor indicates a preselected work, which in the case of works,
    //   we don't want.
    if (parentUrl.includes('#')) {
      return null;
    }
    return promiseThrottle.add(async () => {
      const {$$} = await getDomForUrl(parentUrl);

      // There are some empty anchors (not sure their use as they
      //   just seem to lead into the main part of the document), so we only
      //   want `a[href]`

      const mainSections = $$(
        '.publication-page-contents h1 a[href],' +

        // Some pages like https://www.bahai.org/library/authoritative-texts/abdul-baha/additional-prayers-revealed-abdul-baha/
        //   have their data in a table; there are multiple repeats (date, to,
        //   and summary have their own copies of the link), so only choose
        //   the first
        '#letterstable td:first-child > a[href]'
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

      // eslint-disable-next-line no-console -- Logging
      console.log('Processed work URL for sections', parentUrl);

      return {
        mainSections,
        subSections
      };
    });
  }).filter((item) => {
    return item;
  }))).reduce((obj, {mainSections, subSections}) => {
    obj.mainSections.push(...mainSections);
    obj.subSections.push(...subSections);
    return obj;
  }, {
    mainSections: [],
    subSections: []
  });

  // May have already been visited, e.g.,
  //  "Additional Prayers Revealed by Bahá’u’lláh" is listed once under the
  //  "Writings of Bahá’u’lláh" section and another time under the
  //  "Prayers of Bahá’u’lláh, the Báb, and ‘Abdu’l‑Bahá" section
  const urlToIDMap = new Map();
  await Promise.all(sections.mainSections.map((mainSection) => {
    const {url} = mainSection;
    if (urlToIDMap.has(url)) {
      mainSection.id = urlToIDMap.get(url);
      return null;
    }
    return promiseThrottle.add(async () => {
      const {$} = await getDomForUrl(url);
      const id = $('.brl-tableofcontents h1 > a').href.replace(
        idFind, idReplace
      );
      mainSection.id = id;
      urlToIDMap.set(url, id);

      // eslint-disable-next-line no-console -- Logging
      console.log('Processed main section URL for ID', url);
    });
  }));

  await writeJSONFile(join(dataDir, 'sections.json'), sections);

  return sections;
}

export {
  downloadAndSaveMainCollections, downloadAndSaveCollections,
  downloadAndSaveWorks, downloadAndSaveSections
};
