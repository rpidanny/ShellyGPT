import { jest } from '@jest/globals';
import { resolve } from 'path';

process.env.TS_NODE_PROJECT = resolve('test/tsconfig.json');
process.env.NODE_ENV = 'development';

global.oclif = global.oclif || {};
global.oclif.columns = 80;
global.jest = jest;
