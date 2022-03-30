import {readFile} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} work
 * @param {number} paragraph
 * @returns {Promise<string>}
 */
async function getIdForWorkAndParagraph (work, paragraph) {
  return JSON.parse(
    await readFile(join(__dirname, 'data', work, 'paragraphs-to-ids.json'))
  )[paragraph];
}

/**
 * @param {string} work
 * @param {string} id
 * @returns {Promise<string>}
 */
async function getParagraphForWorkAndId (work, id) {
  return Number.parseInt(JSON.parse(
    await readFile(join(__dirname, 'data', work, 'ids-to-paragraphs.json'))
  )[id]);
}

export {
  getIdForWorkAndParagraph,
  getParagraphForWorkAndId
};
