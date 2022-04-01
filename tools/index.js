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
const mainCollections = process.argv.includes('mainCollections')
  ? await downloadAndSaveMainCollections()
  : await getMainCollections();

const collections = process.argv.includes('collections')
  ? await downloadAndSaveCollections(mainCollections)
  : await getCollections();

const works = process.argv.includes('works')
  ? await downloadAndSaveWorks(collections)
  : await getWorks();

const sections = process.argv.includes('sections')
  ? await downloadAndSaveSections(works)
  : await getSections();

if (process.argv.includes('paragraphIdInfo')) {
  await downloadAndSaveParagraphIdInfo(sections);
}
})();
