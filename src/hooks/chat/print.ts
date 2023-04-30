import { Hook } from '@oclif/core';

import { printChatMessage } from '../../utils/ui.js';
import { IChatMessage } from './interfaces.js';

const hook: Hook<'chat'> = async function ({ chat }) {
  printChatMessage(chat as IChatMessage, this.log);
};

export default hook;
