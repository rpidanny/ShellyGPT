import { Flags } from '@oclif/core';

import { BaseCommand } from '../../baseCommand.js';
import { HistoryService } from '../../services/history/history.js';
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
      const historyService = await this.getHistoryService();
      const history = await historyService.getHistory(collection);

      for (const line of history) {
        uiOutput.printChatMessage(line, (msg) => this.log(msg));
      }
    } catch (err) {
      this.log(`No history for this collection.`);
    }
  }

  getHistoryService(): HistoryService {
    return new HistoryService(this.config.dataDir);
  }
}
