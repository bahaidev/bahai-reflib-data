# CHANGES for `bahai-reflib-data`

## ?

- fix(`downloadAndSave`): adjust changed CSS selector
- chore: update data

## 0.12.2

- fix(`getIdForWorkSectionAndParagraph`): check for alternative title
- chore: update devDeps.

## 0.12.1

- fix(`getParagraphsForWorkAndSection`): check for alternative title

## 0.12.0

- feat(`getFullInfoForUrl`): allow to get the full info for a main section
  (opening line) URL

## 0.11.0

- feat(`getSectionInfoForWork`): add new method
- feat(`getParagraphsForSectionId`): add new method
- fix(`getSectionNamesForWork`): ensure returns from `mainSections` if not
  found in `subSections` (will get first lines)
- fix(`getUrlForWorkAndSection`): gets the paragraphs for a work and first line

## 0.10.0

- fix(`getWorks`): avoid returning duplicate work names
- fix(section-building): avoid duplicate sections
- feat: allow avoiding continuation checks in building

## 0.9.4

- fix: expose missing `getData.js` functions to public API

## 0.9.3

- fix: strip the slash in joined URL for sake of precise permission
  requirements in Chrome extension

## 0.9.2

- fix: ensure getting paragraph info for properly anchored URLs

## 0.9.1

- fix: ensure getting paragraph info for properly anchored URLs

## 0.9.0

- feat: add `getFullInfoForUrl`

## 0.8.0

- feat: add `getUrlForWorkAndSection`
- feat: add `getParagraphsForWorkAndSection`

## 0.7.0

- feat: add `getSubsectionUrlForWork`
- feat: add `getUrlForWork`
- fix: build

## 0.6.0

- feat: make browser/webextension-friendly build

## 0.5.2

- fix: due to Reflib sometimes using different characters for their
  Table of Contents and headings (at least in Persian), with ID not available,
  we match by URL instead

## 0.5.1

- fix: merging issue
- test: adds Persian tests

## 0.5.0

- feat: support Persian and all language processing (site is currently
    limited to Persian and English)
- chore: update devDeps.
- chore: lint in TS mode

## 0.4.0

- feat: adds `getWorkNames`, `getSectionNamesForWork`

## 0.3.2

- fix: remove optional chaining use from browser-facing API

## 0.3.1

- docs: disclaimer on individual effort; link to site and server project;
  move to-dos

## 0.3.0

- feat: add `getInfoForId`, `getUrlForId`

## 0.2.0

- feat: `getIdForUrl`, `getInfoForUrl`

## 0.1.0

- Initial release
