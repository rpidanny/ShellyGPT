import { Hook } from '@oclif/core';

import uiOutput from '../../utils/ui/output.js';

const hook: Hook<'command_not_found'> = async function (opts) {
  uiOutput.printInvalidCommandMessage(opts.id, this.log);
  this.exit(1);
};

export default hook;
