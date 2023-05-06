import { Hook } from '@oclif/core';

import uiOutput from '../../utils/ui/output.js';

const hook: Hook<'init'> = async function () {
  uiOutput.printBanner(this.config.version, this.log);
};

export default hook;
