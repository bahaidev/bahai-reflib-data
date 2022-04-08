/* eslint-env browser -- Browser */
import {setJoin, setFetch} from './getData.js';
import {setDataDir} from './pathInfo.js';

const join = (...paths) => {
  return paths.join('/');
};

const __dirname = new URL('.', import.meta.url).pathname;
const dataDir = join(__dirname, 'data');

setDataDir(dataDir);
setJoin(join);
setFetch(self.fetch);

export * from './index.js';
