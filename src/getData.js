import {readFile} from 'fs/promises';
import {join} from 'path';
import {dataDir} from './pathInfo.js';

/**
 * @returns {Promise<MainCollection[]>}
 */
async function getMainCollections () {
  return JSON.parse(await readFile(join(dataDir, 'mainCollections.json')));
}

/**
 * @returns {Promise<Collection[]>}
 */
async function getCollections () {
  return JSON.parse(await readFile(join(dataDir, 'collections.json')));
}

/**
 * @returns {Promise<Work[]>}
 */
async function getWorks () {
  return JSON.parse(await readFile(join(dataDir, 'works.json')));
}

/**
 * @returns {Promise<Section[]>}
 */
async function getSections () {
  return JSON.parse(await readFile(join(dataDir, 'sections.json')));
}

/**
 * @returns {Promise<ParagraphIdInfo>}
 */
async function getIdsToSectionsAndParagraphs () {
  return JSON.parse(
    await readFile(join(dataDir, 'ids-to-works-sections-and-paragraphs.json'))
  );
}

/**
 * @returns {Promise<ParagraphIdInfo>}
 */
async function getSectionsAndParagraphsToIds () {
  return JSON.parse(
    await readFile(join(dataDir, 'works-sections-and-paragraphs-to-ids.json'))
  );
}

export {
  getMainCollections, getCollections,
  getWorks, getSections,
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds
};
