import {
  getWorkSectionAndParagraphForId, getIdForWorkSectionAndParagraph,
  getIdForUrl, getInfoForUrl, getInfoForId, getUrlForId,
  getWorkNames, getSectionNamesForWork
} from '../src/index.js';

import {
  getMainCollections, getCollections, getWorks, getSections
} from '../src/getData.js';

describe('getMainCollections', function () {
  it('gets a main collection', async function () {
    expect((await getMainCollections())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/',
      url: 'https://www.bahai.org/library/authoritative-texts/',
      title: 'Authoritative Writings and Guidance'
    });
  });
});

describe('getCollections', function () {
  it('gets a collection', async function () {
    expect((await getCollections())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      title: 'Writings of Bahá’u’lláh'
    });
  });
});

describe('getWorks', function () {
  it('gets a work', async function () {
    expect((await getWorks())[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      title: 'The Call of the Divine Beloved'
    });
  });
});

describe('getSections', function () {
  it('gets a main section', async function () {
    expect((await getSections()).mainSections[0]).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/call-divine-beloved/1',
      title: 'The Call of the Divine Beloved',
      id: '959114648'
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
});

describe('getIdForWorkAndParagraph', function () {
  it('gets the ID for a work and paragraph', async function () {
    const {work, section, paragraph} = await getWorkSectionAndParagraphForId(
      '148954012'
    );

    expect(work).to.equal('The Call of the Divine Beloved');
    expect(section).to.equal('Rashḥ-i-‘Amá (The Clouds of the Realms Above)');
    expect(paragraph).to.equal(6);
  });
});

describe('getIdForWorkAndParagraph', function () {
  it('gets the ID for a work and paragraph', async function () {
    const id = await getIdForWorkSectionAndParagraph(
      'The Call of the Divine Beloved',
      'Rashḥ-i-‘Amá (The Clouds of the Realms Above)', 6
    );

    expect(id).to.equal('148954012');
  });
});

describe('getIdForUrl', function () {
  it('gets the ID for a main section URL', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/epistle-son-wolf/1'
    );

    expect(id).to.equal('804716281');
  });

  it('gets the ID for a subsection URL', async function () {
    const id = await getIdForUrl(
      'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059'
    );

    expect(id).to.equal('819748059');
  });

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

  it('gets the info for a subsection ID', async function () {
    const info = await getInfoForId('819748059');

    expect(info).to.deep.equal({
      parentUrl: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/',
      id: '819748059',
      url: 'https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059',
      title: 'Lawḥ-i-‘Áshiq va Ma‘shúq (Tablet of the Lover and the Beloved)'
    });
  });

  it('gets the URL for a (subsection) ID', async function () {
    const url = await getUrlForId('819748059');

    expect(url).to.equal('https://www.bahai.org/library/authoritative-texts/bahaullah/days-remembrance/4#819748059');
  });
});

describe('`getWorkNames`', function () {
  it('gets the work names', async function () {
    const workNames = await getWorkNames();
    expect(workNames).to.be.lengthOf(89);
    expect(workNames).to.contain('The Call of the Divine Beloved');
    expect(workNames).to.contain('Days of Remembrance');
  });
});

describe('`getSectionNamesForWork`', function () {
  it('gets the section names for a work', async function () {
    const sectionNames = await getSectionNamesForWork('Days of Remembrance');
    expect(sectionNames).to.be.lengthOf(55);
    expect(sectionNames).to.contain('Naw-Rúz');
    expect(sectionNames).to.contain('Riḍván');
  });
});
