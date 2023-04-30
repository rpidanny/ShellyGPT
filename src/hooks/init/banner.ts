import { Hook } from '@oclif/core';

import { printBanner } from '../../utils/ui.js';

const hook: Hook<'init'> = async function (opts) {
  printBanner(this.config.version, this.log);
};

export default hook;
