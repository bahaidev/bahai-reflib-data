import {getDataDir, getLanguageSuffix} from './pathInfo.js';

let join;
const setJoin = (_join) => {
  join = _join;
};

let fetch;
const setFetch = (_fetch) => {
  fetch = _fetch;
};

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
 * @typedef {any} ObjectItem
 */

/**
 * Simple object check.
 * @param {ObjectItem} item
 * @returns {boolean}
 * @see https://stackoverflow.com/a/34749873/271577
 */
export function isObject (item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param {object} target
 * @param {object[]} sources
 * @returns {object}
 * @see https://stackoverflow.com/a/34749873/271577
 */
export function mergeDeep (target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }
        mergeDeep(target[key], source[key]);
      } else if (Array.isArray(target[key])) {
        target[key].push(...source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * @param {object[]} objs
 * @returns {object}
 */
const mergeArrayOfObjects = (objs) => {
  if (Array.isArray(objs[0])) {
    return mergeArrayOfArrays(objs);
  }
  return mergeDeep({}, ...objs);
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
    return await (
      await fetch(join(getDataDir(), converter(lang)))
    ).json();
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
  setJoin, setFetch,
  getMainCollections, getCollections,
  getWorks, getSections,
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds
};
