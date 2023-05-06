import { Hook } from '@oclif/core';

import ui from '../../utils/ui.js';
import { IChatMessage } from './interfaces.js';

const hook: Hook<'chat'> = async function ({ chat }) {
  ui.printChatMessage(chat as IChatMessage, this.log);
};

export default hook;
