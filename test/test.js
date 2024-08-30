import {expect} from 'chai';

import {
  getMainCollections, getCollections, getWorks, getSections
} from '../src/getData.js';

import {getLanguagePrefix} from '../src/pathInfo.js';

const range = (num) => {
  return Array.from({length: num}, (_, i) => {
    return String(i + 1);
  });
};

// eslint-disable-next-line unicorn/prefer-top-level-await -- Needed
(async () => {
const {
  getFullInfoForUrl,
  getWorkSectionAndParagraphForId, getIdForWorkSectionAndParagraph,
  getIdForUrl, getInfoForUrl, getInfoForId, getUrlForId,
  getWorkNames, getSectionNamesForWork, getSectionInfoForWork, getUrlForWork,
  getSubsectionUrlForWork, getUrlForWorkAndSection,
  getParagraphsForWorkAndSection,
  getParagraphsForSectionId
// // eslint-disable-next-line no-unsanitized/method -- Testing
} = await import(
  typeof window !== 'undefined'
    ? '../src/index-browser.js'
    : '../src/index-node.js'
);

describe('`getMainCollections`', function () {
  it('gets a main collection', async function () {
    expect((await getMainCollections())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/',
      url: 'https://www.bahai.org/library/authoritative-texts/',
      title: 'Authoritative Writings and Guidance'
    });
  });

  it('gets a main collection (Persian)', async function () {
    expect((await getMainCollections('fa'))[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/',
      title: 'مراجع آثار و هدایات'
    });
  });
});

describe('`getCollections`', function () {
  it('gets a collection', async function () {
    expect((await getCollections())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      title: 'Writings of Bahá’u’lláh'
    });
  });

  it('gets a collection (Persian)', async function () {
    expect((await getCollections('fa'))[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/',
      title: 'آثار حضرت بهاءالله'
    });
  });
});

describe('`getWorks`', function () {
  it('gets a work', async function () {
    expect((await getWorks())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      title: 'The Call of the Divine Beloved'
    });
  });

  it('gets a work (Persian)', async function () {
    expect((await getWorks('fa'))[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/gems-divine-mysteries/',
      title: 'جواهر الاسرار'
    });
  });
});

describe('`getSections`', function () {
  it('gets a main section', async function () {
    expect((await getSections()).mainSections[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/1',
      title: 'The Call of the Divine Beloved',
      id: '959114648'
    });
  });

  it('gets a main section (Persian)', async function () {
    expect((await getSections('fa')).mainSections[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/gems-divine-mysteries/',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/gems-divine-mysteries/1',
      title: 'جواهر الاسرار',
      id: '983578094'
    });
  });

  it('gets a subsection', async function () {
    expect((await getSections()).subSections[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      id: '026070931',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/2#026070931',
      title: 'Preface'
    });
  });

  it('gets a subsection (Persian)', async function () {
    expect((await getSections('fa')).subSections[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/tabernacle-unity/',
      id: '825528209',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/bahaullah/tabernacle-unity/2#825528209',
      title: 'مقدّمه'
    });
  });
});

describe('`getFullInfoForUrl`', function () {
  it('gets the full info for a URL', async function () {
    const url = 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/3#874317698';
    const fullInfo = await getFullInfoForUrl(url);
    expect(fullInfo).to.deep.equal({
      mainSectionId: '959114648',
      mainSectionParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      mainSectionTitle: 'The Call of the Divine Beloved',
      mainSectionUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/1',
      subSectionId: '874317698',
      subSectionParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      subSectionTitle: 'Rashḥ-i-‘Amá (The Clouds of the Realms Above)',
      subSectionUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/3#874317698',
      workParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      workTitle: 'The Call of the Divine Beloved',
      workUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/'
    });
  });

  it(
    'gets the full info for a main section (opening line) URL',
    async function () {
      const url = 'https://www.bahai.org/library/authoritative-texts/bahaullah/additional-prayers-revealed-bahaullah/639512072/1';
      const fullInfo = await getFullInfoForUrl(url);
      expect(fullInfo).to.deep.equal({
        mainSectionId: '542155991',
        mainSectionParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/additional-prayers-revealed-bahaullah/',
        mainSectionTitle: 'O God, my God! I yield Thee thanks for having ' +
          'guided me unto Thy straight Path and enabled me...',
        mainSectionUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/additional-prayers-revealed-bahaullah/639512072/1',
        subSectionId: undefined,
        subSectionParentUrl: undefined,
        subSectionTitle: undefined,
        subSectionUrl: undefined,
        workParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
        workTitle: 'Additional Prayers Revealed by Bahá’u’lláh',
        workUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/additional-prayers-revealed-bahaullah/'
      });
    }
  );

  it('gets the full info for a URL (with anchor)', async function () {
    const url = 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/5#154708814';
    const fullInfo = await getFullInfoForUrl(url);
    expect(fullInfo).to.deep.equal({
      mainSectionId: '640354408',
      mainSectionParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/',
      mainSectionTitle: 'Days of Remembrance',
      mainSectionUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/1',
      paragraph: 5,
      section: '“He is the Ever-Abiding, the Most Exalted, the Most Great …”',
      subSectionId: '396118651',
      subSectionParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/',
      subSectionTitle:
        '“He is the Ever-Abiding, the Most Exalted, the Most Great …”',
      subSectionUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/5#396118651',
      work: 'Days of Remembrance',
      workParentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      workTitle: 'Days of Remembrance',
      workUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/'
    });
  });

  it('gets `false` for a bad URL', async function () {
    const url = 'badURL';
    const fullInfo = await getFullInfoForUrl(url);
    expect(fullInfo).to.equal(false);
  });
});

describe('`getWorkSectionAndParagraphForId`', function () {
  it('gets the work, section, and paragraph for an ID', async function () {
    const {work, section, paragraph} = await getWorkSectionAndParagraphForId(
      '148954012'
    );

    expect(work).to.equal('The Call of the Divine Beloved');
    expect(section).to.equal('Rashḥ-i-‘Amá (The Clouds of the Realms Above)');
    expect(paragraph).to.equal(6);
  });

  it(
    'gets the work, (main) section, and paragraph for an ID (Persian)',
    async function () {
      const {work, section, paragraph} = await getWorkSectionAndParagraphForId(
        '825528201',
        'fa'
      );

      expect(work).to.equal('سراپردهٔ یگانگی');
      expect(section).to.equal('$main');
      expect(paragraph).to.equal(null);
    }
  );

  it(
    'gets the work, section, and paragraph for an ID (Persian)',
    async function () {
      const {work, section, paragraph} = await getWorkSectionAndParagraphForId(
        '167639371',
        'fa'
      );

      expect(work).to.equal('سراپردهٔ یگانگی');
      expect(section).to.equal('مقدّمه');
      expect(paragraph).to.equal(null);
    }
  );
});

describe('`getIdForWorkSectionAndParagraph`', function () {
  it('gets the ID for a work, section, and paragraph', async function () {
    const id = await getIdForWorkSectionAndParagraph(
      'The Call of the Divine Beloved',
      'Rashḥ-i-‘Amá (The Clouds of the Realms Above)',
      6
    );

    expect(id).to.equal('148954012');
  });

  it(
    'gets the ID(s) for a work, (main) section, and paragraph (Persian)',
    async function () {
      const id = await getIdForWorkSectionAndParagraph(
        'سراپردهٔ یگانگی',
        '$main',
        null,
        'fa'
      );

      expect(id).to.deep.equal(['825528201']);
    }
  );

  it(
    'gets the ID(s) for a work, section, and paragraph (Persian)',
    async function () {
      const id = await getIdForWorkSectionAndParagraph(
        'سراپردهٔ یگانگی',
        'مقدّمه',
        null,
        'fa'
      );

      expect(id).to.deep.equal([
        '825528200',
        '167639371',
        '167639372',
        '167639373',
        '167639374',
        '167639375',
        '167639376'
      ]);
    }
  );
});

describe('`getParagraphsForWorkAndSection`', function () {
  it('gets the paragraphs for a work and section', async function () {
    const paragraphs = await getParagraphsForWorkAndSection(
      'Days of Remembrance',
      '“He it is Who is established upon this luminous Throne …”'
    );
    const expected = range(34);
    expect(paragraphs).to.deep.equal(expected);
  });

  it('returns undefined for a bad work', async function () {
    const paragraphs = await getParagraphsForWorkAndSection(
      'Non-existent',
      '“He it is Who is established upon this luminous Throne…”'
    );
    expect(paragraphs).to.equal(undefined);
  });

  it('returns undefined for a bad section', async function () {
    const paragraphs = await getParagraphsForWorkAndSection(
      'Days of Remembrance',
      'Non-existent'
    );
    expect(paragraphs).to.equal(undefined);
  });

  it('returns undefined for missing valid paragraphs', async function () {
    const paragraphs = await getParagraphsForWorkAndSection(
      'The Call of the Divine Beloved',
      'Preface'
    );
    expect(paragraphs).to.equal(undefined);
  });

  it('returns undefined for a bad section (Persian)', async function () {
    const paragraphs = await getParagraphsForWorkAndSection(
      'جواهر الاسرار',
      'Non-existent',
      'fa'
    );
    expect(paragraphs).to.equal(undefined);
  });
});

describe('`getParagraphsForSectionId`', function () {
  it('gets the paragraphs for a section ID', async function () {
    const paragraphs = await getParagraphsForSectionId(
      '874317698'
    );
    const expected = range(20);
    expect(paragraphs).to.deep.equal(expected);
  });

  it('also gets the paragraphs for a section ID', async function () {
    const paragraphs = await getParagraphsForSectionId(
      '366312870'
    );
    const expected = range(62);
    expect(paragraphs).to.deep.equal(expected);
  });

  it('returns undefined for a bad section ID', async function () {
    const paragraphs = await getParagraphsForSectionId(
      '000000000'
    );
    expect(paragraphs).to.equal(undefined);
  });

  it(
    'returns undefined for a (main) section ID without paragraphs',
    async function () {
      const paragraphs = await getParagraphsForSectionId(
        '959114648'
      );
      const expected = undefined;
      expect(paragraphs).to.deep.equal(expected);
    }
  );
});

describe('`getIdForUrl`', function () {
  it('gets the ID for a main section URL', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/epistle-son-wolf/1'
    );
    expect(id).to.equal('804716281');
  });

  it('gets the ID for a main section URL (Persian)', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/fa/library/authoritative-texts/abdul-baha/additional-tablets-talks-abdul-baha/170477513/1',
      'fa'
    );
    expect(id).to.equal('101761591');
  });

  it('gets the ID for a subsection URL', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059'
    );
    expect(id).to.equal('819748059');
  });

  it('gets the ID for a subsection URL (Persian)', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/8#327359949',
      'fa'
    );
    expect(id).to.equal('327359949');
  });
});

describe('`getInfoForUrl`', function () {
  it('gets the info for a subsection URL', async function () {
    const info = await getInfoForUrl(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059'
    );

    expect(info).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/',
      id: '819748059',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059',
      title: 'Lawḥ-i-‘Áshiq va Ma‘shúq (Tablet of the Lover and the Beloved)'
    });
  });

  it('gets the info for a subsection URL (Persian)', async function () {
    const info = await getInfoForUrl(
      'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/8#327359949',
      'fa'
    );

    expect(info).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/',
      id: '327359949',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/8#327359949',
      title: 'توقیع مبارک نوروز ۱۱۱ بدیع'
    });
  });
});

describe('`getInfoForId`', function () {
  it('gets the info for a subsection ID', async function () {
    const info = await getInfoForId('819748059');

    expect(info).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/',
      id: '819748059',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059',
      title: 'Lawḥ-i-‘Áshiq va Ma‘shúq (Tablet of the Lover and the Beloved)'
    });
  });

  it('gets the info for a subsection ID (Persian)', async function () {
    const info = await getInfoForId('327359949', 'fa');

    expect(info).to.deep.equal({
      parentUrl: 'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/',
      id: '327359949',
      url: 'https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/8#327359949',
      title: 'توقیع مبارک نوروز ۱۱۱ بدیع'
    });
  });
});

describe('`getUrlForId`', function () {
  it('gets the URL for a (subsection) ID', async function () {
    const url = await getUrlForId('819748059');

    expect(url).to.equal('https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059');
  });

  it('gets the URL for a (subsection) ID (Persian)', async function () {
    const url = await getUrlForId('327359949', 'fa');

    expect(url).to.equal('https://www.bahai.org/fa/library/authoritative-texts/shoghi-effendi/letters-shoghi-effendi/8#327359949');
  });
});

describe('`getWorkNames`', function () {
  it('gets the work names', async function () {
    const workNames = await getWorkNames();
    expect(workNames).to.be.lengthOf(115);
    expect(workNames).to.contain('The Call of the Divine Beloved');
    expect(workNames).to.contain('Days of Remembrance');
  });

  it('gets the work names (English)', async function () {
    const workNames = await getWorkNames('en');
    expect(workNames).to.be.lengthOf(89);
    expect(workNames).to.contain('The Call of the Divine Beloved');
    expect(workNames).to.contain('Days of Remembrance');
  });

  it('gets the work names (Persian)', async function () {
    const workNames = await getWorkNames('fa');
    expect(workNames).to.be.lengthOf(26);

    expect(workNames).to.contain('سراپردۀ يگانگی');
    expect(workNames).to.contain('مقاله شخصى سياح');
    expect(workNames).to.contain(
      'دوازده گفتگوی حضرت عبدالبهاء بر سر نهار در عکّا'
    );
  });
});

describe('`getSectionNamesForWork`', function () {
  it('gets the lines for a work', async function () {
    const sectionNames = await getSectionNamesForWork(
      'Additional Prayers Revealed by Bahá’u’lláh'
    );
    expect(sectionNames).to.be.lengthOf(23);
    expect(sectionNames).to.contain(
      'Praise be to Thee, O my God, that Thou didst graciously ' +
        'remember me through Thy Most...'
    );
    expect(sectionNames).to.contain(
      // eslint-disable-next-line @stylistic/max-len -- Long
      'O Thou by Whose name the sea of joy moveth and the fragrance of happiness is...'
    );
  });
  it('gets the section names for a work', async function () {
    const sectionNames = await getSectionNamesForWork('Days of Remembrance');
    expect(sectionNames).to.be.lengthOf(55);
    expect(sectionNames).to.contain('Naw-Rúz');
    expect(sectionNames).to.contain('Riḍván');
  });

  it('gets the section names for a work (Persian)', async function () {
    const sectionNames = await getSectionNamesForWork(
      'سراپردۀ يگانگی',
      'fa'
    );
    expect(sectionNames).to.be.lengthOf(6);
    expect(sectionNames).to.contain('مقدّمه');
    expect(sectionNames).to.contain('۱. لوح مانکچی صاحب');
  });
});

describe('`getSectionInfoForWork`', function () {
  it('gets the section IDs for a work with lines', async function () {
    const sectionIDs = await getSectionInfoForWork(
      'Additional Prayers Revealed by Bahá’u’lláh'
    );
    expect(sectionIDs).to.be.lengthOf(23);
    expect(sectionIDs[0].id).to.equal(
      '575481039'
    );
    expect(sectionIDs[1].id).to.equal(
      '638416360'
    );
  });
  it('gets the section IDs for a work', async function () {
    const sectionIDs = await getSectionInfoForWork('Days of Remembrance');
    expect(sectionIDs).to.be.lengthOf(55);
    expect(sectionIDs[0].id).to.equal('768390050');
    expect(sectionIDs[1].id).to.equal('902693089');
  });
});

describe('`getUrlForWork`', function () {
  it('gets a URL for a work', async function () {
    const url = await getUrlForWork('Consultation');
    expect(url).to.equal('https://www.bahai.org/library/authoritative-texts/compilations/consultation/');
  });

  it('gets a URL for a work (Persian)', async function () {
    const url = await getUrlForWork('سراپردۀ يگانگی');
    expect(url).to.equal('https://www.bahai.org/fa/library/authoritative-texts/bahaullah/tabernacle-unity/');
  });
});

describe('`getSubsectionUrlForWork`', function () {
  it('gets a URL for a work', async function () {
    const url = await getSubsectionUrlForWork('Consultation');
    expect(url).to.equal('https://www.bahai.org/library/authoritative-texts/compilations/consultation/1');
  });

  it('gets a URL for a work (Persian)', async function () {
    const url = await getSubsectionUrlForWork('سراپردۀ يگانگی');
    expect(url).to.equal('https://www.bahai.org/fa/library/authoritative-texts/bahaullah/tabernacle-unity/1');
  });
});

describe('`getUrlForWorkAndSection`', function () {
  it('gets URL for a work and section', async function () {
    const url = await getUrlForWorkAndSection(
      'The Call of the Divine Beloved',
      'Rashḥ-i-‘Amá (The Clouds of the Realms Above)'
    );
    expect(url).to.equal('https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/3#874317698');
  });

  it('gets the paragraphs for a work and first line', async function () {
    const url = await getUrlForWorkAndSection(
      'Additional Prayers Revealed by Bahá’u’lláh',
      // eslint-disable-next-line @stylistic/max-len -- Long
      'O Thou Who holdest within Thy grasp the Kingdom of names and the Empire of all things...'
    );
    expect(url).to.equal(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/additional-prayers-revealed-bahaullah/449222680/1'
    );
  });

  it('gets URL for a work and section (Persian)', async function () {
    const url = await getUrlForWorkAndSection(
      'سراپردۀ يگانگی',
      '۱. لوح مانکچی صاحب',
      'fa'
    );
    expect(url).to.equal('https://www.bahai.org/fa/library/authoritative-texts/bahaullah/tabernacle-unity/3#167639377');
  });
});

describe('`getLanguagePrefix`', function () {
  it('gets the English language prefix', function () {
    const prefix = getLanguagePrefix('en');
    expect(prefix).to.equal('');
  });
  it('gets other language prefixes (Persian)', function () {
    const prefix = getLanguagePrefix('fa');
    expect(prefix).to.equal('/fa');
  });
});

// Mocha delay
if (typeof run !== 'undefined') {
  run();
} else if (typeof mocha !== 'undefined') {
  mocha.run();
}
})();
