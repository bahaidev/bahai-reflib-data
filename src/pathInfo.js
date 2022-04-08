let dataDir;
const getDataDir = () => {
  return dataDir;
};
const setDataDir = (_dataDkr) => {
  dataDir = _dataDkr;
};

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

export {getDataDir, setDataDir, getLanguagePrefix, getLanguageSuffix};
