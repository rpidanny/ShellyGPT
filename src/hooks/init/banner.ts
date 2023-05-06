import { Hook } from '@oclif/core';

import ui from '../../utils/ui.js';

const hook: Hook<'init'> = async function () {
  ui.printBanner(this.config.version, this.log);
};

export default hook;
