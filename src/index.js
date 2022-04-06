import {
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds, getSections
} from './getData.js';

/**
 * @param {string} id
 * @returns {Promise<{work: string, section: string, paragraph: number}>}
 */
async function getWorkSectionAndParagraphForId (id) {
  return (await getIdsToSectionsAndParagraphs())[id];
}

/**
 * @param {string} work
 * @param {string} section
 * @param {number} paragraph
 * @returns {Promise<string>}
 */
async function getIdForWorkSectionAndParagraph (work, section, paragraph) {
  return (await getSectionsAndParagraphsToIds())[work][section][paragraph];
}

/**
* @typedef {{
*   parentUrl: string, url: string, title: string, id: string
* }} SectionInfo
*/

/**
 * @param {string} url
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForUrl (url) {
  const sections = await getSections();

  const found = sections.mainSections.find(({url: mainSectionUrl}) => {
    return mainSectionUrl === url;
  });

  return found || sections.subSections.find(({url: subSectionUrl}) => {
    return subSectionUrl === url;
  });
}

/**
 * @param {string} url
 * @returns {string|undefined}
 */
async function getIdForUrl (url) {
  const info = await getInfoForUrl(url);
  return info && info.id;
}

/**
 * @param {string} id
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForId (id) {
  const sections = await getSections();
  const info = sections.mainSections.find(({id: mainSectionId}) => {
    return mainSectionId === id;
  });

  return (info || sections.subSections.find(({id: subSectionId}) => {
    return subSectionId === id;
  }));
}

/**
 * @param {string} id
 * @returns {Promise<string|undefined>}
 */
async function getUrlForId (id) {
  const info = await getInfoForId(id);
  return info && info.url;
}

export {
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getInfoForUrl,
  getIdForUrl,
  getInfoForId,
  getUrlForId
};
