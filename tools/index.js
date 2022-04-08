import '../src/index-node.js'; // Set-up code

import {
  downloadAndSaveMainCollections, downloadAndSaveCollections,
  downloadAndSaveWorks, downloadAndSaveSections,
  downloadAndSaveParagraphIdInfo
} from './downloadAndSave.js';

import {
  getMainCollections, getCollections,
  getWorks, getSections
} from '../src/getData.js';

(async () => {
const language = process.argv.includes('fa') ? 'fa' : 'en';
const mainCollections = process.argv.includes('mainCollections')
  ? await downloadAndSaveMainCollections(language)
  : await getMainCollections(language);

const collections = process.argv.includes('collections')
  ? await downloadAndSaveCollections(mainCollections, language)
  : await getCollections(language);

const works = process.argv.includes('works')
  ? await downloadAndSaveWorks(collections, language)
  : await getWorks(language);

const sections = process.argv.includes('sections')
  ? await downloadAndSaveSections(works, language)
  : await getSections(language);

if (process.argv.includes('paragraphIdInfo')) {
  await downloadAndSaveParagraphIdInfo(sections, language);
}
})();
