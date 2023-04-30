import { Args, Flags, ux } from '@oclif/core';

import { BaseCommand } from '../../baseCommand.js';
import { DataLoaderService } from '../../services/data-loader/data-loader.service.js';
import { ShellyService } from '../../services/shelly/shelly.service.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';
import { Sender } from '../../utils/sender.enums.js';

export default class Ask extends BaseCommand<typeof Ask> {
  static description = 'Ask questions or instruct shelly to do something.';

  static examples = [
    '<%= config.bin %> <%= command.id %> --collection=foo "how do i do something?"',
  ];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'enable verbose mode',
    }),
    collection: Flags.string({
      char: 'c',
      description: 'vector collection to use',
      default: 'ShellyDefault',
    }),
  };

  static args = {
    question: Args.string({
      description: 'The question you want answered',
      required: true,
    }),
  };

  public async run(): Promise<string> {
    const { collection, verbose } = this.flags;
    const { question } = this.args;

    await this.emitMessageEvent(question, collection, Sender.User);

    ux.action.start('running');

    const shelly = await this.getShelly(verbose);

    const answer = await shelly.ask(question, collection);

    ux.action.stop();

    await this.emitMessageEvent(answer, collection, Sender.Shelly);

    return answer;
  }

  async getShelly(verbose: boolean): Promise<ShellyService> {
    const vectorStoreService = new VectorStoreService(this.localConfig);
    const dataLoaderService = new DataLoaderService();
    return new ShellyService(
      { dataLoaderService, vectorStoreService },
      this.localConfig,
      verbose
    );
  }

  private async emitMessageEvent(
    message: string,
    collection: string,
    sender: string
  ) {
    await this.config.runHook('chat', {
      chat: {
        date: new Date(),
        message,
        collection,
        sender,
      },
    });
  }
}
