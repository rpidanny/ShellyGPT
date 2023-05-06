import { Hook } from '@oclif/core';

import uiOutput from '../../utils/ui/output.js';
import { IChatMessage } from './interfaces.js';

const hook: Hook<'chat'> = async function ({ chat }) {
  uiOutput.printChatMessage(chat as IChatMessage, this.log);
};

export default hook;
