import { Flags } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';

import { BaseCommand } from '../../baseCommand.js';
import { IChatMessage } from '../../hooks/chat/interfaces.js';
import uiOutput from '../../utils/ui/output.js';

export default class History extends BaseCommand<typeof History> {
  static enableJsonFlag = false;

  static description = 'Print history';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --collection=foo',
  ];

  static flags = {
    collection: Flags.string({
      char: 'c',
      description: 'vector collection to use',
      default: 'ShellyDefault',
    }),
  };

  static args = {};

  public async run(): Promise<void> {
    const { collection } = this.flags;

    try {
      const historyFilePath = path.join(
        this.config.dataDir,
        'history',
        `${collection}.jsonl`
      );
      const history = await fs.readFile(historyFilePath, 'utf-8');

      for (const line of history.split('\n')) {
        if (!line || line === '') continue;
        const chat: IChatMessage = JSON.parse(line);
        uiOutput.printChatMessage(chat, (msg) => this.log(msg));
      }
    } catch (err) {
      this.log(`No history for this collection.`);
    }
  }
}
