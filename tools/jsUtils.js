import {writeFile} from 'fs/promises';

/**
 * @param {string} path
 * @param {JSON} obj
 * @returns {Promise<void>}
 */
async function writeJSONFile (path, obj) {
  return await writeFile(path, JSON.stringify(obj, null, 2) + '\n');
}

export {writeJSONFile};
