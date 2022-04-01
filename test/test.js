import {
  getWorkSectionAndParagraphForId, getIdForWorkSectionAndParagraph
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
