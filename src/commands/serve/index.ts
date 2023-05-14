import { Flags } from '@oclif/core';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAIChat } from 'langchain/llms/openai';

import { BaseCommand } from '../../baseCommand.js';
import { AskService } from '../../services/ask/ask.js';
import { HistoryService } from '../../services/history/history.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';
import { WebService } from '../../services/web/web.js';

export default class Serve extends BaseCommand<typeof Serve> {
  static description = 'start the Shelly web service';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'enable verbose mode',
    }),
    collection: Flags.string({
      char: 'c',
      description: 'vector collection to use',
      required: true,
    }),
    port: Flags.string({
      char: 'p',
      description: 'the port number to run the server on',
      default: '3000',
    }),
  };

  static args = {};

  public async run(): Promise<void> {
    const { collection, verbose, port } = this.flags;

    const service = this.getWebService(verbose);

    await service.start(parseInt(port), collection);
  }

  getWebService(verbose: boolean): WebService {
    return new WebService(
      {
        askService: this.getAskService(verbose),
        historyService: this.getHistoryService(),
      },
      this
    );
  }

  getHistoryService(): HistoryService {
    return new HistoryService(this.config.dataDir);
  }

  getAskService(verbose: boolean): AskService {
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
}
