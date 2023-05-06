import { Args, Flags, ux } from '@oclif/core';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAIChat } from 'langchain/llms/openai';

import { BaseCommand } from '../../baseCommand.js';
import { AskService } from '../../services/ask/ask.js';
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

    const shelly = await this.getAskService(verbose);

    const answer = await shelly.askAboutCollection(question, collection);

    ux.action.stop();

    await this.emitMessageEvent(answer, collection, Sender.Shelly);

    return answer;
  }

  async getAskService(verbose: boolean): Promise<AskService> {
    const llm = new OpenAIChat({
      openAIApiKey: this.localConfig.openAi.apiKey,
      modelName: this.localConfig.openAi.chatModel,
      verbose,
    });
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.localConfig.openAi.apiKey,
      modelName: this.localConfig.openAi.embeddingsModel,
      verbose,
    });
    const vectorStoreService = new VectorStoreService(this.localConfig);
    return new AskService({ vectorStoreService, llm, embeddings });
  }

  private async emitMessageEvent(
    message: string,
    collection: string,
    sender: string
  ) {
    await this.config.runHook('chat', {
      chat: {
        date: new Date().toUTCString(),
        message,
        collection,
        sender,
      },
    });
  }
}
