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
 * @param {MainCollection[]} mainCollections
 * @returns {Promise<Collection[]>}
 */
async function getCollections (mainCollections) {
  return JSON.parse(await readFile(join(dataDir, 'collections.json')));
}

/**
 * @param {Collection[]} collections
 * @returns {Work[]}
 */
async function getWorks (collections) {
  return JSON.parse(await readFile(join(dataDir, 'works.json')));
}

/**
 * @param {Work[]} works
 * @returns {Section[]}
 */
async function getSections (works) {
  return JSON.parse(await readFile(join(dataDir, 'sections.json')));
}

export {
  getMainCollections, getCollections,
  getWorks, getSections
};
