/* eslint-env node -- Node */
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import _fetch from 'file-fetch';
import {setJoin, setFetch} from './getData.js';
import {setDataDir} from './pathInfo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

setDataDir(dataDir);
setJoin(join);
setFetch(_fetch);

export * from './index.js';
