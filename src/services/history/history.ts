import fs from 'fs-extra';
import path from 'path';

import { IChatMessage } from '../../hooks/chat/interfaces.js';

export class HistoryService {
  constructor(private readonly dataDir: string) {}

  async storeMessage(msg: IChatMessage): Promise<void> {
    const historyFilePath = path.join(
      this.dataDir,
      'history',
      `${msg.collection}.jsonl`
    );

    await fs.ensureFile(historyFilePath);
    await fs.appendFile(historyFilePath, `${JSON.stringify(msg)}\n`);
  }

  async getHistory(collection: string): Promise<IChatMessage[]> {
    const history: IChatMessage[] = [];

    const historyFilePath = path.join(
      this.dataDir,
      'history',
      `${collection}.jsonl`
    );

    if (!(await fs.pathExists(historyFilePath))) return [];

    const lines = await fs.readFile(historyFilePath, 'utf-8');

    for (const line of lines.split('\n')) {
      if (!line || line === '') continue;
      history.push(JSON.parse(line) as IChatMessage);
    }

    return history;
  }
}
