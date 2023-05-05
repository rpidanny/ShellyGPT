import { Args, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { OpenAIChat } from 'langchain/llms/openai';
import { NodeFileStore } from 'langchain/stores/file/node';

import { BaseCommand } from '../../baseCommand.js';
import { EventsService } from '../../services/events/events.js';
import { ICalTool } from '../../utils/tools/ical.js';

export default class Create extends BaseCommand<typeof Create> {
  static description = 'Create iCal events';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'enable verbose mode',
    }),
  };

  static args = {
    description: Args.string({
      description:
        'The description of the even you want created in natural language',
      required: true,
    }),
  };

  public async run(): Promise<string> {
    const { verbose } = this.flags;
    const { description } = this.args;

    ux.action.start('running');

    const service = await this.getEventsService(verbose);

    const resp = await service.create(description);

    ux.action.stop();

    this.log(chalk.green(resp));

    return resp;
  }

  async getEventsService(verbose: boolean): Promise<EventsService> {
    const llm = new OpenAIChat({
      openAIApiKey: this.localConfig.openAi.apiKey,
      modelName: this.localConfig.openAi.chatModel,
      verbose,
    });

    const iCalTool = new ICalTool({
      store: new NodeFileStore(process.cwd()),
      llm,
      verbose,
    });

    return new EventsService({ tool: iCalTool });
  }
}
