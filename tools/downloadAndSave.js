import {join} from 'path';

import PromiseThrottle from 'promise-throttle';

import {getDomForUrl} from './fetchDom.js';
import {writeJSONFile} from './jsUtils.js';
import {
  getDataDir, getLanguageSuffix, getLanguagePrefix
} from '../src/pathInfo.js';

const requestsPerSecond = 0.2;
const doubleAngleQuotes = /»/gu;
const idFind = /#(?<id>\d+)$/u;

const setWorksSectionsAndParagraphsToIds = (
  obj, mainSectionTitle, title, idElem
) => {
  const paragraphNumber = Number.parseInt(
    idElem.previousElementSibling?.textContent?.trim()
  );
  if (!obj[mainSectionTitle]) {
    obj[mainSectionTitle] = {};
  }
  if (!obj[mainSectionTitle][title]) {
    obj[mainSectionTitle][title] = {};
  }
  if (Number.isNaN(paragraphNumber)) {
    // We create an array even for `$main` because Tablets can actually have
    //   the same title in the same work, e.g.:
    // "In the Name of our Lord, the Most Holy, the Most Great, the Exalted,
    //   the Most Glorious!"
    if (!obj[mainSectionTitle][title].null) {
      obj[mainSectionTitle][title].null = [];
    }
    if (!obj[mainSectionTitle][title].null.includes(idElem.id)) {
      obj[mainSectionTitle][title].null.push(idElem.id);
    }
    return obj;
  }
  obj[mainSectionTitle][title][paragraphNumber] = idElem.id;
  return obj;
};

const setIdsToWorksSectionsAndParagraphs = (
  obj, mainSectionTitle, title, idElem
) => {
  const paragraphNumber = Number.parseInt(
    idElem.previousElementSibling?.textContent?.trim()
  );
  obj[idElem.id] = {
    work: mainSectionTitle,
    section: title,
    paragraph: Number.isNaN(paragraphNumber) ? null : paragraphNumber
  };
  return obj;
};

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
 * @param {"fa"|"en"} language
 * @returns {Promise<MainCollection[]>}
 */
async function downloadAndSaveMainCollections (language) {
  const parentUrl = `https://www.bahai.org${
    getLanguagePrefix(language)
  }/library/`;
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

  await writeJSONFile(
    join(
      getDataDir(),
      `mainCollections${getLanguageSuffix(language)}.json`
    ),
    mainCollections
  );

  return mainCollections;
}

/**
 * @param {MainCollection[]} mainCollections
 * @param {"fa"|"en"} language
 * @returns {Promise<Collection[]>}
 */
async function downloadAndSaveCollections (mainCollections, language) {
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond
  });

  const collections = (await Promise.all(
    mainCollections.map(({url: parentUrl}) => {
      return promiseThrottle.add(async () => {
        const {$$} = await getDomForUrl(parentUrl);

        // eslint-disable-next-line no-console -- Logging
        console.log(
          'Processed main collection URL for collections', parentUrl
        );

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

  await writeJSONFile(
    join(
      getDataDir(),
      `collections${getLanguageSuffix(language)}.json`
    ),
    collections
  );

  return collections;
}

/**
 * @typedef {Collection} Work
 */

/**
 * @param {Collection[]} collections
 * @param {"fa"|"en"} language
 * @returns {Promise<Work[]>}
 */
async function downloadAndSaveWorks (collections, language) {
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond
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

  await writeJSONFile(
    join(getDataDir(), `works${getLanguageSuffix(language)}.json`),
    works
  );

  return works;
}

/**
 * @typedef {{mainSections: Collection[], subSections: Collection[]}} Work
 */

/**
 * @param {Work[]} works
 * @param {"fa"|"en"} language
 * @returns {Promise<Section[]>}
 */
async function downloadAndSaveSections (works, language) {
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond
  });

  // NOTE: There is some redundancy here; we could cache URL for results, as
  //  some works are duplicates in terms of being repeated in another
  //  collection (we keep them as separate sections though as they have
  //  different meta-data due to having different parents).

  const sections = (await Promise.all(works.map(({url: parentUrl}) => {
    // Avoid preprocessing items like Promise of World Peace which, though
    //   being independent works, show up on a page with already processed
    //   messages; the anchor indicates a preselected work, which in the case
    //   of works, we don't want.
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
        const url = a.href;
        // NOTE: This excludes a handful of meta sections (only in
        //    English to date):
        // 1. Memorials of the Faithful: "List of individuals"
        // 2. Citadel of Faith: "List of topics" and "In Memoriam"
        // 3. Promised Day Is Come: "List of sections"
        // 4. This Decisive Hour: "List of topics"
        // 5. Turning Point For All Nations: This empty item: https://www.bahai.org/library/other-literature/official-statements-commentaries/turning-point-all-nations/#tpan_en-tp
        const {
          groups: {number}
        } = (/(?<number>\d+)#/u).exec(url) || {groups: {}};

        if (!number) {
          return null;
        }

        return {
          parentUrl,
          id: idFind.exec(url).groups.id,
          url,
          title: a.textContent.replace(doubleAngleQuotes, '').trim()
        };
      }).filter(Boolean);

      // eslint-disable-next-line no-console -- Logging
      console.log('Processed work URL for sections', parentUrl);

      return {
        mainSections,
        subSections
      };
    });
  }).filter(Boolean))).reduce((obj, {mainSections, subSections}) => {
    // We could improve this by checking for redundancy, e.g., `187607508`,
    //  "Prayers and Meditations of Bahá'u'lláh" appears twice, once listed
    //  on the prayers once in the Writings of Bahá'u'lláh; but we may want
    //  it separate if we instead wish to add the collection URL here, since
    //  that should differ.
    mainSections.forEach((mainSection) => {
      if (!obj.mainSections.some((existingMainSection) => {
        return existingMainSection.url === mainSection.url;
      })) {
        obj.mainSections.push(mainSection);
      }
    });
    subSections.forEach((subSection) => {
      if (!obj.subSections.some((existingSubSection) => {
        return existingSubSection.url === subSection.url;
      })) {
        obj.subSections.push(subSection);
      }
    });
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
    return promiseThrottle.add(async () => {
      // Delay this check as other promises may have since populated the value
      if (urlToIDMap.has(url)) {
        mainSection.id = urlToIDMap.get(url);
        return;
      }

      const {$} = await getDomForUrl(url);
      const {id} = idFind.exec($('.brl-tableofcontents h1 > a').href).groups;
      mainSection.id = id;
      urlToIDMap.set(url, id);

      // eslint-disable-next-line no-console -- Logging
      console.log('Processed main section URL for ID', url);
    });
  }));

  await writeJSONFile(
    join(getDataDir(), `sections${getLanguageSuffix(language)}.json`),
    sections
  );

  return sections;
}

/**
 * @param {Section[]} sections
 * @param {"fa"|"en"} language
 * @param {boolean} noContinuation
 * @returns {Promise<Section[]>}
 */
async function downloadAndSaveAmendedSections (
  sections, language, noContinuation
) {
  const {subSections} = sections;
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond
  });

  const urlToSubsectionNumberMap = {};
  subSections.forEach(({parentUrl, url, title}, idx) => {
    if (!urlToSubsectionNumberMap[parentUrl]) {
      urlToSubsectionNumberMap[parentUrl] = [];
    }
    const {
      groups: {number}
    } = (/(?<number>\d+)#/u).exec(url);

    urlToSubsectionNumberMap[parentUrl].push({
      idx,
      title,
      number: Number.parseInt(number)
    });
  });

  const urlInfo = [];
  Object.entries(urlToSubsectionNumberMap).forEach(([
    parentUrl, numbers
  ]) => {
    let offset = 0;
    numbers.forEach(({number, idx}, numberIdx) => {
      let ct = numberIdx + 1 + offset;
      const titleMap = {};
      while (number > ct) {
        if (ct !== 1) {
          const {title} = subSections[idx - 1];
          if (!titleMap[title]) {
            titleMap[title] = 1;
          }
          titleMap[title]++;

          urlInfo.push({
            spliceIndex: idx,
            baseURL: `${parentUrl}${ct}`,
            title: title + ` (${titleMap[title]})`,
            parentUrl
          });
        }
        offset++;
        ct = numberIdx + 1 + offset;
      }
    });

    if (!noContinuation) {
      const {idx, number, title} = numbers[numbers.length - 1];
      urlInfo.push({
        number,
        checkForContinuation: true,
        spliceIndex: idx,
        baseURL: `${parentUrl}${number}`,
        title,
        parentUrl
      });
    }
  });

  const doms = (await Promise.all(urlInfo.map(async ({
    baseURL, title, spliceIndex, parentUrl, checkForContinuation, number
  }) => {
    if (checkForContinuation) {
      const hrefs = [];
      let id;
      let href = baseURL;
      let ct = 2;
      while (href) {
        // eslint-disable-next-line max-len -- Too long
        // eslint-disable-next-line no-await-in-loop, no-loop-func -- Has to be sequential
        href = await promiseThrottle.add(async () => {
          // eslint-disable-next-line no-console -- Info
          console.log(`Checking ${href} for continuation`);
          const {$$: $_} = await getDomForUrl(href);

          const {
            href: _href
          } = $_('.js-continue-below > .js-continue-link') || {};
          ({id} = $_('.brl-location').pop());

          return _href;
        });

        if (href) {
          // eslint-disable-next-line no-console -- Info
          console.log(`Found ${href} for continuation`);
          hrefs.push(
            {
              id,
              url: `${baseURL}#${id}`,
              title: `${title} (${ct})`,
              spliceIndex,
              parentUrl
            }
          );
          ct++;
        }
      }
      return hrefs;
    }

    return promiseThrottle.add(async () => {
      // eslint-disable-next-line no-console -- Info
      console.log(`Checking ${baseURL} for ID`);
      const {$$: $_} = await getDomForUrl(baseURL);
      const {id} = $_('.brl-location').pop();

      // eslint-disable-next-line no-console -- Logging
      console.log('adding', {
        id,
        url: `${baseURL}#${id}`,
        title,
        spliceIndex,
        parentUrl
      });
      return {
        id,
        url: `${baseURL}#${id}`,
        title,
        spliceIndex,
        parentUrl
      };
    });
  }))).filter(Boolean).flat();

  doms.forEach(({
    spliceIndex, $, title, id, url, parentUrl
  }, i) => {
    subSections.splice(spliceIndex + i, 0, {
      parentUrl,
      id,
      url,
      title
    });
  });

  await writeJSONFile(
    join(getDataDir(), `sections${getLanguageSuffix(language)}.json`),
    sections
  );

  return sections;
}

/**
 * @param {Section[]} sections
 * @param {"fa"|"en"} language
 * @returns {Promise<void>}
 */
async function downloadAndSaveParagraphIdInfo (sections, language) {
  const promiseThrottle = new PromiseThrottle({
    requestsPerSecond
  });

  const worksSectionsAndParagraphsToIds = {};
  const idsToWorksSectionsAndParagraphs = {};

  await Promise.all(sections.mainSections.map(({
    title, id
  }) => {
    const sectionTitle = '$main';

    setWorksSectionsAndParagraphsToIds(
      worksSectionsAndParagraphsToIds, title, sectionTitle, {id}
    );

    setIdsToWorksSectionsAndParagraphs(
      idsToWorksSectionsAndParagraphs, title, sectionTitle, {id}
    );

    return null;
  }));

  await Promise.all(sections.subSections.map(({
    url, title, parentUrl
  }) => {
    return promiseThrottle.add(async () => {
      const {$$} = await getDomForUrl(url);

      // There are some titles that match but they don't have pnum content, so
      //   restrict to those within paragraphs
      // <a class="brl-pnum">9</a> <a id="282442314" class="brl-location"></a>
      const idElems = $$('p > a.brl-pnum + a.brl-location');

      const {
        title: mainSectionTitle
      } = sections.mainSections.find(({parentUrl: mainSectionUrl}) => {
        return parentUrl === mainSectionUrl;
      });

      idElems.reduce((obj, idElem) => {
        return setWorksSectionsAndParagraphsToIds(
          obj, mainSectionTitle, title, idElem
        );
      }, worksSectionsAndParagraphsToIds);

      idElems.reduce((obj, idElem) => {
        return setIdsToWorksSectionsAndParagraphs(
          obj, mainSectionTitle, title, idElem
        );
      }, idsToWorksSectionsAndParagraphs);

      // eslint-disable-next-line no-console -- Logging
      console.log(
        `Processed subsection URL for ${mainSectionTitle}, ${title} ` +
          `ID/paragraph`,
        url
      );
    });
  }));

  await Promise.all([
    writeJSONFile(
      join(
        getDataDir(),
        `works-sections-and-paragraphs-to-ids${
          getLanguageSuffix(language)
        }.json`
      ),
      worksSectionsAndParagraphsToIds
    ),
    writeJSONFile(
      join(
        getDataDir(),
        `ids-to-works-sections-and-paragraphs${
          getLanguageSuffix(language)
        }.json`
      ),
      idsToWorksSectionsAndParagraphs
    )
  ]);
}

export {
  downloadAndSaveMainCollections, downloadAndSaveCollections,
  downloadAndSaveWorks, downloadAndSaveSections,
  downloadAndSaveAmendedSections,
  downloadAndSaveParagraphIdInfo
};
