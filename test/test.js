import {
  getIdForWorkAndParagraph, getParagraphForWorkAndId
} from '../src/index.js';

describe('getIdForWorkAndParagraph', function () {
  it('gets the ID for a work and paragraph', async function () {
    const id = await getIdForWorkAndParagraph('Rashḥ-i-‘Amá', 6);

    expect(id).to.equal('148954012');
  });
});

describe('getIdForWorkAndParagraph', function () {
  it('gets the ID for a work and paragraph', async function () {
    const paragraph = await getParagraphForWorkAndId(
      'Rashḥ-i-‘Amá', '148954012'
    );

    expect(paragraph).to.equal(6);
  });
});
