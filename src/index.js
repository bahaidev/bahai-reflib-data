import {
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds, getSections,
  getWorks
} from './getData.js';

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<{work: string, section: string, paragraph: number}>}
 */
async function getWorkSectionAndParagraphForId (id, language) {
  return (await getIdsToSectionsAndParagraphs(language))[id];
}

/**
 * @param {string} work
 * @param {string} section
 * @param {number} paragraph
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string>}
 */
async function getIdForWorkSectionAndParagraph (
  work, section, paragraph, language
) {
  return (await getSectionsAndParagraphsToIds(
    language
  ))[work][section][paragraph];
}

/**
* @typedef {{
*   parentUrl: string, url: string, title: string, id: string
* }} SectionInfo
*/

/**
 * @param {string} url
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForUrl (url, language) {
  const sections = await getSections(language);

  const found = sections.mainSections.find(({url: mainSectionUrl}) => {
    return mainSectionUrl === url;
  });

  return found || sections.subSections.find(({url: subSectionUrl}) => {
    return subSectionUrl === url;
  });
}

/**
 * @param {string} url
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {string|undefined}
 */
async function getIdForUrl (url, language) {
  const info = await getInfoForUrl(url, language);
  return info && info.id;
}

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForId (id, language) {
  const sections = await getSections(language);
  const info = sections.mainSections.find(({id: mainSectionId}) => {
    return mainSectionId === id;
  });

  return (info || sections.subSections.find(({id: subSectionId}) => {
    return subSectionId === id;
  }));
}

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string|undefined>}
 */
async function getUrlForId (id, language) {
  const info = await getInfoForId(id, language);
  return info && info.url;
}

/**
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {string[]}
 */
async function getWorkNames (language) {
  const works = (await getWorks(language)).map(({title}) => {
    return title;
  });
  return works;
}

/**
 * @param {string} work
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {string[]}
 */
async function getSectionNamesForWork (work, language) {
  const [works, sections] = await Promise.all([
    getWorks(language),
    getSections(language)
  ]);
  return sections.subSections.filter(({parentUrl}) => {
    // Due to a mismatch between the title found on the Table of Contents,
    //   and the one found as a heading on the page (e.g.,
    //   'سراپردۀ يگانگی' and 'سراپردهٔ یگانگی', we need to match another way
    //   between section and work. But since the Table of Contents
    //   apparently doesn't store the ID, we need to check the works,
    //   directly, cross-referenced by parentUrl/url
    const mainSection = sections.mainSections.find(({
      parentUrl: mainSectionParentUrl
    }) => {
      return mainSectionParentUrl === works.find(({url, title}) => {
        return work === title;
      }).url;
    });
    return mainSection && mainSection.parentUrl === parentUrl;
  }).map(({title}) => {
    return title;
  });
}

export {
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getInfoForUrl,
  getIdForUrl,
  getInfoForId,
  getUrlForId,
  getWorkNames,
  getSectionNamesForWork
};
