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
 * @param {string} url
 * @returns {string|undefined}
 */
async function getIdForUrl (url) {
  return (await getInfoForUrl(url))?.id;
}

/**
 * @param {string} url
 * @returns {Promise<{
 *   parentUrl: string, url: string, title: string, id: string
 * }|undefined>}
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
 * @param {string} id
 * @returns {Promise<string|undefined>}
 */
async function getUrlForId (id) {
  const sections = await getSections();
  let found = sections.mainSections.find(({id: mainSectionId}) => {
    return mainSectionId === id;
  });

  found = (found || sections.subSections.find(({id: subSectionId}) => {
    return subSectionId === id;
  }));

  return found && found.url;
}

export {
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getIdForUrl,
  getInfoForUrl,
  getUrlForId
};
