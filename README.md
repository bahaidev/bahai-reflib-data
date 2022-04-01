# bahai-reflib-data

This project aims to host information on the official Bahá'í Reference Library
website, in particular its unique identifiers, and host scripts for obtaining
and processing those IDs, such as to map them to paragraph number.

Per <https://bahai-library.com/uhj_additional_tablets_urls>, it seems that the
URLS hosted on <https://bahai.org/library> may now be permanent, and it is
hoped that since the paragraphs are not transparent, that the IDs might be
permanent as well.

One bit of info: typing <https://bahai.org/r/[ID]> and replacing `[ID]` with
the unique ID will redirect to the URL and potentially anchor that it
targets.

***Note that this is a work in progress. Currently only hosts data for
the Rashḥ-i-‘Amá, though we can gather the IDs by adding (or crawling for)
more titles with their URL metadata.***

## Development

1. `npm i -g pnpm` (If you don't have it installed already)
1. `pnpm i` (Install dependencies)
1. `pnpm build-data` followed by any of these optional arguments (though
    choosing at least one):
    `mainCollections`, `collections`, `works`, `sections`, `paragraphIdInfo` to
    run the (throttled) downloading and saving of the information

## To-dos

1. Put online as a **JSON service** (using, e.g., for Bahaipedia and Bahai9
    links)
1. Put online as a **web app**, allowing a series of pull-downs for work,
    section, and paragraph number to get the ID and link.
1. Utilize in restoration of **webextensions**-based Bahá'í Reference Library
    Wiki Overlay add-on

## Possible to-dos

1. API to **get ID or work/section/paragraph info for URL**
1. **RSS feed for new additions** to the library (based on a date-detected
    field)
