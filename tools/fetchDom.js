import JSDOM from 'jsdom';

import fetch from 'node-fetch';

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml (url) {
  const resp = await fetch(url);
  return await resp.text();
}

/**
 * @typedef {{$: $, $$: $$, document: HTMLDocument}} DomInfo
 */

/**
 * @param {string} html
 * @param {string} url
 * @returns {DomInfo}
 */
function getDomForHtml (html, url) {
  const {document} = new JSDOM.JSDOM(html, {url}).window;

  /**
   * @callback $
   * @param {string} selector
   * @returns {HTMLElement}
   */

  /**
   * @callback $$
   * @param {string} selector
   * @returns {HTMLElement[]}
   */

  /** @type {$} */
  const $ = (s) => document.querySelector(s);

  /** @type {$$} */
  const $$ = (s) => [...document.querySelectorAll(s)];

  return {$, $$, document};
}

/**
 * @param {string} url
 * @returns {Promise<DomInfo>}
 */
async function getDomForUrl (url) {
  const html = await fetchHtml(url);
  // console.log('html', html);
  return getDomForHtml(html, url);
}

export {fetchHtml, getDomForHtml, getDomForUrl};
