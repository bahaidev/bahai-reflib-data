import {
  getIdsToSectionsAndParagraphs, getSectionsAndParagraphsToIds, getSections,
  getWorks
} from './getData.js';

export {
  setJoin,
  setFetch,
  getMainCollections,
  getCollections,
  getWorks,
  getSections,
  getIdsToSectionsAndParagraphs,
  getSectionsAndParagraphsToIds
} from './getData.js';

/**
 * @todo Should build optimized version to avoid all this processing
 * @todo Might not get full info if two identical works have different
 * `parentUrl`'s (e.g., "Additional Prayers Revealed by Bahá’u’lláh")
 * @param {string} url
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<{work: string, section: string, paragraph: number}|false>}
 */
async function getFullInfoForUrl (url, language) {
  const [
    idsToSectionsAndParagraphs, works, sections
  ] = await Promise.all([
    getIdsToSectionsAndParagraphs(language),
    getWorks(language),
    getSections(language)
  ]);

  const {
    groups: {baseURL, id}
  } = url.match(/(?<baseURL>^.*\/\d#)(?<id>\d+)$/u) || {groups: {}};

  if (!id) {
    return false;
  }
  const workSectionParagraph = idsToSectionsAndParagraphs[id];

  const subSectionInfo = workSectionParagraph
    ? sections.subSections.find(({
      url: subSectionUrl, parentUrl, title: sectionTitle
    }) => {
      return subSectionUrl.includes(baseURL) &&
        sectionTitle === workSectionParagraph.section;
    })
    : sections.subSections.find(({
      url: subSectionUrl, parentUrl, title: sectionTitle
    }) => {
      return subSectionUrl.includes(baseURL);
    });

  /* c8 ignore next 3 */
  if (!subSectionInfo) {
    return false;
  }

  // See discussion below on another `sections.mainSections.find`
  const mainSectionInfo = sections.mainSections.find(({
    parentUrl: mainSectionParentUrl
  }) => {
    return mainSectionParentUrl === subSectionInfo.parentUrl;
  });

  /* c8 ignore next 3 */
  if (!mainSectionInfo) {
    return false;
  }

  const workInfo = works.find(({url: workUrl}) => {
    return subSectionInfo.parentUrl === workUrl;
  });

  /* c8 ignore next 3 */
  if (!workInfo) {
    return false;
  }

  const {
    parentUrl: subSectionParentUrl,
    url: subSectionUrl,
    title: subSectionTitle,
    id: subSectionId
  } = subSectionInfo;

  const {
    parentUrl: mainSectionParentUrl,
    url: mainSectionUrl,
    title: mainSectionTitle,
    id: mainSectionId
  } = mainSectionInfo;

  const {
    parentUrl: workParentUrl,
    url: workUrl,
    title: workTitle
  } = workInfo;

  return {
    ...workSectionParagraph,
    subSectionParentUrl, subSectionUrl, subSectionTitle, subSectionId,
    mainSectionParentUrl, mainSectionUrl, mainSectionTitle, mainSectionId,
    workParentUrl, workUrl, workTitle
  };
}

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<{work: string, section: string, paragraph: number}>}
 */
async function getWorkSectionAndParagraphForId (id, language) {
  return (await getIdsToSectionsAndParagraphs(language))[id];
}

/**
 * @param {string} work
 * @param {string} section
 * @param {number} paragraph
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string>}
 */
async function getIdForWorkSectionAndParagraph (
  work, section, paragraph, language
) {
  return (await getSectionsAndParagraphsToIds(
    language
  ))[work][section][paragraph];
}

/**
 * @param {string} work
 * @param {string} section
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string>}
 */
async function getParagraphsForWorkAndSection (
  work, section, language
) {
  const sectionsAndParagraphs = await getSectionsAndParagraphsToIds(
    language
  );

  const sections = sectionsAndParagraphs[work];
  if (!sections) {
    return undefined;
  }

  const paragraphsToIds = sections[section];
  if (!paragraphsToIds) {
    return undefined;
  }

  const array = Object.keys(paragraphsToIds).filter((par) => {
    return par !== 'null';
  });

  return array.length ? array : undefined;
}

/**
* @typedef {{
*   parentUrl: string, url: string, title: string, id: string
* }} SectionInfo
*/

/**
 * @param {string} url
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForUrl (url, language) {
  const sections = await getSections(language);

  const found = sections.mainSections.find(({url: mainSectionUrl}) => {
    return mainSectionUrl === url;
  });

  return found || sections.subSections.find(({url: subSectionUrl}) => {
    return subSectionUrl === url;
  });
}

/**
 * @param {string} url
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string|undefined>}
 */
async function getIdForUrl (url, language) {
  const info = await getInfoForUrl(url, language);
  return info && info.id;
}

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<SectionInfo|undefined>}
 */
async function getInfoForId (id, language) {
  const sections = await getSections(language);
  const info = sections.mainSections.find(({id: mainSectionId}) => {
    return mainSectionId === id;
  });

  return (info || sections.subSections.find(({id: subSectionId}) => {
    return subSectionId === id;
  }));
}

/**
 * @param {string} id
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string|undefined>}
 */
async function getUrlForId (id, language) {
  const info = await getInfoForId(id, language);
  return info && info.url;
}

/**
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string[]>}
 */
async function getWorkNames (language) {
  const works = await getWorks(language);
  // Avoid some duplicates whose title and url are the same, but have a
  //  separate entry given being listed on a different `parentUrl` page
  return works.filter((work, i) => {
    const idx = works.findIndex((comparedWork) => {
      return work.url === comparedWork.url;
    });
    return idx === i;
  }).map(({title}) => {
    return title;
  });
}

/**
 * @param {string} work
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string[]>}
 */
async function getSectionNamesForWork (work, language) {
  const [works, sections] = await Promise.all([
    getWorks(language),
    getSections(language)
  ]);
  return sections.subSections.filter(({parentUrl}) => {
    // Due to a mismatch between the title found on the Table of Contents,
    //   and the one found as a heading on the page (e.g.,
    //   'سراپردۀ يگانگی' and 'سراپردهٔ یگانگی', we need to match another way
    //   between section and work. But since the Table of Contents
    //   apparently doesn't store the ID, we need to check the works,
    //   directly, cross-referenced by parentUrl/url
    const mainSection = sections.mainSections.find(({
      parentUrl: mainSectionParentUrl
    }) => {
      const found = works.find(({title}) => {
        return work === title;
      });
      /* c8 ignore next 3 */
      if (!found) {
        return false;
      }
      return mainSectionParentUrl === found.url;
    });
    return mainSection && mainSection.parentUrl === parentUrl;
  }).map(({title}) => {
    return title;
  });
}

/**
 * @param {string} work
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string>}
 */
async function getUrlForWork (work, language) {
  const found = (await getWorks(language)).find(({title}) => {
    return title === work;
  });

  return found && found.url;
}

/**
 * @param {string} work
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string>}
 */
async function getSubsectionUrlForWork (work, language) {
  const [works, sections] = await Promise.all([
    getWorks(language),
    getSections(language)
  ]);
  const found = sections.mainSections.find(({
    parentUrl: mainSectionParentUrl
  }) => {
    // See discussion above on another `sections.mainSections.find`
    const innerFound = works.find(({title}) => {
      return work === title;
    });
    /* c8 ignore next 3 */
    if (!innerFound) {
      return false;
    }
    return mainSectionParentUrl === innerFound.url;
  });

  return found && found.url;
}

/**
 * @param {string} work
 * @param {string} section
 * @param {"fa"|"en"} [language] If none is provided, will check all languages
 * @returns {Promise<string[]>}
 */
async function getUrlForWorkAndSection (work, section, language) {
  const [works, sections] = await Promise.all([
    getWorks(language),
    getSections(language)
  ]);
  const subSectionFound = sections.subSections.find(({
    parentUrl, title: sectionTitle
  }) => {
    // See discussion above on another `sections.mainSections.find`
    const mainSection = sections.mainSections.find(({
      parentUrl: mainSectionParentUrl
    }) => {
      const found = works.find(({title}) => {
        return work === title;
      });

      /* c8 ignore next 3 */
      if (!found) {
        return false;
      }
      return mainSectionParentUrl === found.url;
    });
    return mainSection && mainSection.parentUrl === parentUrl &&
      sectionTitle === section;
  });

  return subSectionFound && subSectionFound.url;
}

export {
  getFullInfoForUrl,
  getWorkSectionAndParagraphForId,
  getIdForWorkSectionAndParagraph,
  getParagraphsForWorkAndSection,
  getInfoForUrl,
  getIdForUrl,
  getInfoForId,
  getUrlForId,
  getWorkNames,
  getSectionNamesForWork,
  getUrlForWork,
  getSubsectionUrlForWork,
  getUrlForWorkAndSection
};
