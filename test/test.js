import {
  getMainCollections, getCollections, getWorks, getSections
} from '../src/getData.js';

import {getLanguagePrefix} from '../src/pathInfo.js';

(async () => {
const {
  getWorkSectionAndParagraphForId, getIdForWorkSectionAndParagraph,
  getIdForUrl, getInfoForUrl, getInfoForId, getUrlForId,
  getWorkNames, getSectionNamesForWork, getUrlForWork,
  getSubsectionUrlForWork
// eslint-disable-next-line no-unsanitized/method -- Testing
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
