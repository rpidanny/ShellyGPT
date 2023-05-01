import { Hook } from '@oclif/core';

import { printInvalidCommandMessage } from '../../utils/ui.js';

const hook: Hook<'command_not_found'> = async function (opts) {
  printInvalidCommandMessage(opts.id, this.log);
  this.exit(1);
};

export default hook;
