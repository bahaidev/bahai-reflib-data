import {writeFile} from 'fs/promises';

/**
 * @param {string} path
 * @param {JSON} obj
 * @returns {Promise<void>}
 */
async function writeJSONFile (path, obj) {
  return await writeFile(path, JSON.stringify(obj, null, 2) + '\n');
}

const keysValuesFlip = (obj) => {
  return Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
};

export {writeJSONFile, keysValuesFlip};
