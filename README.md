# bahai-reflib-data

This project aims to host information on the official
[Bahá'í Reference Library](https://bahai.org/library)
website, in particular its unique identifiers, and host scripts for obtaining
and processing those IDs, such as to map them to paragraph number.

Note that although this uses data from the Bahá'í Reference Library, this is
just an individual effort not related to the site.

Per <https://bahai-library.com/uhj_additional_tablets_urls>, it seems that the
URLS hosted on <https://bahai.org/library> may now be permanent, and it is
hoped that since the paragraphs are not transparent, that the IDs might be
permanent as well.

One bit of info: typing <https://bahai.org/r/[ID]> and replacing `[ID]` with
the unique ID will redirect to the URL and potentially anchor that it
targets.

A **server** is available via
[bahai-reflib-data-server](https://github.com/bahaidev/bahai-reflib-data-server).

## Development

1. `npm i -g pnpm` (If you don't have it installed already)
1. `pnpm i` (Install dependencies)
1. `pnpm build-data` followed by any of these optional arguments (though
    choosing at least one):
    `mainCollections`, `collections`, `works`, `sections`, `paragraphIdInfo` to
    run the (throttled) downloading and saving of the information

## To-dos

1. Fix apparent bug with Kitáb-i-Aqdas not gathering paragraphs

## Possible to-dos

1. Gather mini-sections (ensure talks are included)
1. Waiting: Once ready, add the **Arabic** or any other languages added later
    (The Arabic has not been ported to the new site.) Should just need to
    populate the `allLanguages` array. (We could scrape "Other languages"
    from <https://www.bahai.org/library/> but no telling if that structure
    will stay the same.)
1. **RSS feed for new additions** to the library (based on a date-detected
    field)
