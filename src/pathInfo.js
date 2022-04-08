import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

/**
 * @param {"fa"|"en"} language
 * @returns {string}
 */
const getLanguagePrefix = (language) => {
  return language === 'en' ? '' : '/' + language;
};

/**
 * @param {"fa"|"en"} language
 * @returns {string}
 */
const getLanguageSuffix = (language) => {
  return language === 'en' ? '' : '-' + language;
};

export {dataDir, getLanguagePrefix, getLanguageSuffix};
