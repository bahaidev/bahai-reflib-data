import {readFile} from 'fs/promises';
import {join} from 'path';

import {dataDir, getLanguageSuffix} from './pathInfo.js';

const allLanguages = ['en', 'fa'];

/**
* @typedef {Array} GenericArray
*/

/**
 * @param {Array[]} arrays
 * @returns {GenericArray}
 */
const mergeArrayOfArrays = (arrays) => {
  return arrays.reduce((output, array) => {
    output = [...output, ...array];
    return output;
  }, []);
};

/**
 * @param {object[]} objs
 * @returns {object}
 */
const mergeArrayOfObjects = (objs) => {
  if (Array.isArray(objs[0])) {
    return mergeArrayOfArrays(objs);
  }
  return objs.reduce((output, obj) => {
    output = {...output, ...obj};
    return output;
  }, {});
};

/**
 * @typedef {any} MergedObject
 */

/**
 * @param {string[]} langs
 * @param {(string) => string} converter
 * @returns {MergedObject}
 */
const getMergedLanguageObject = async (langs, converter) => {
  const jsons = await Promise.all(langs.map(async (lang) => {
    return JSON.parse(
      await readFile(join(dataDir, converter(lang)))
    );
  }));
  return mergeArrayOfObjects(jsons);
};

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<MainCollection[]>}
 */
async function getMainCollections (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `mainCollections${getLanguageSuffix(lang)}.json`;
  });
}

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<Collection[]>}
 */
async function getCollections (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `collections${getLanguageSuffix(lang)}.json`;
  });
}

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<Work[]>}
 */
async function getWorks (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `works${getLanguageSuffix(lang)}.json`;
  });
}

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<Section[]>}
 */
async function getSections (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `sections${getLanguageSuffix(lang)}.json`;
  });
}

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<ParagraphIdInfo>}
 */
async function getIdsToSectionsAndParagraphs (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `ids-to-works-sections-and-paragraphs${
      getLanguageSuffix(lang)
    }.json`;
  });
}

/**
 * @param {"fa"|"en"} [language] If not provided, will get all
 * @returns {Promise<ParagraphIdInfo>}
 */
async function getSectionsAndParagraphsToIds (language) {
  const langs = language ? [language] : allLanguages;
  return await getMergedLanguageObject(langs, (lang) => {
    return `works-sections-and-paragraphs-to-ids${
      getLanguageSuffix(lang)
    }.json`;
  });
}

export {
  getMainCollections, getCollections,
  getWorks, getSections,
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds
};
