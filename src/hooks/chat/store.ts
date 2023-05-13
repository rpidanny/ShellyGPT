import { Hook } from '@oclif/core';

import { HistoryService } from '../../services/history/history.js';
import { IChatMessage } from './interfaces.js';

const hook: Hook<'chat'> = async function ({ chat }) {
  const { message, date, sender, collection } = chat as IChatMessage;

  const historyService = new HistoryService(this.config.dataDir);

  await historyService.storeMessage({ date, sender, collection, message });
};

export default hook;
