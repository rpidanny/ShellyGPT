import { Hook } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';

import { IChatMessage } from './interfaces.js';

const hook: Hook<'chat'> = async function ({ chat }) {
  const { message, date, sender, collection } = chat as IChatMessage;
  const historyFilePath = path.join(
    this.config.dataDir,
    'history',
    `${collection}.jsonl`
  );
  await fs.ensureFile(historyFilePath);
  await fs.appendFile(
    historyFilePath,
    `${JSON.stringify({ date, sender, collection, message })}\n`
  );
};

export default hook;
