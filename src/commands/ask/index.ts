import { Args, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

import { BaseCommand } from '../../baseCommand.js';
import { DataLoaderService } from '../../services/data-loader/data-loader.service.js';
import { ShellyService } from '../../services/shelly/shelly.service.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

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

    this.log(`${chalk.bold.blue('Question: ')}: ${question}`);

    ux.action.start('running');

    const shelly = await this.getShelly(verbose);

    const answer = await shelly.ask(question, collection);

    ux.action.stop();

    this.printAnswer(answer);

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

  private printAnswer(answer: string) {
    this.log('');
    this.log(chalk.green.bold('Answer:'));
    this.log(
      marked(
        answer.replace(/```ts/g, '```js').replace(/```typescript/g, '```js')
      )
    );
  }
}
