import {
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds
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

export {
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph
};
