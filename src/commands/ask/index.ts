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
    '<%= config.bin %> <%= command.id %> "How do i list all files in a directory?"',
    '<%= config.bin %> <%= command.id %> --collection=foo "how do i do something?"',
  ];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'enable verbose mode',
    }),
    collection: Flags.string({
      char: 'c',
      description:
        'vector collection to use. If not specified, ignores vector search and performs normal QA without context.',
      required: false,
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

    await this.emitMessageEvent(question, Sender.User, collection);

    ux.action.start('running');

    const shelly = await this.getAskService(verbose);

    let answer;

    if (collection) {
      answer = await shelly.askAboutCollection(question, collection);
    } else {
      answer = await shelly.askQuestion(question);
    }

    ux.action.stop();

    await this.emitMessageEvent(answer, Sender.Shelly, collection);

    return answer;
  }

  async getAskService(verbose: boolean): Promise<AskService> {
    const llm = new OpenAIChat(
      {
        openAIApiKey: this.localConfig.openAi.apiKey,
        modelName: this.localConfig.openAi.chatModel,
        verbose,
      },
      {
        basePath: process.env.OPENAI_API_BASE,
      }
    );
    const embeddings = new OpenAIEmbeddings(
      {
        openAIApiKey: this.localConfig.openAi.apiKey,
        modelName: this.localConfig.openAi.embeddingsModel,
        verbose,
      },
      {
        basePath: process.env.OPENAI_API_BASE,
      }
    );
    const vectorStoreService = new VectorStoreService(this.localConfig);
    return new AskService({ vectorStoreService, llm, embeddings });
  }

  private async emitMessageEvent(
    message: string,
    sender: string,
    collection?: string
  ) {
    await this.config.runHook('chat', {
      chat: {
        date: new Date().toUTCString(),
        message,
        collection: collection || 'default',
        sender,
      },
    });
  }
}
