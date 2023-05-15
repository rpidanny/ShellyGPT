/* eslint-disable camelcase */
import tiktoken, { TiktokenEncoding } from '@dqbd/tiktoken';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { Document } from 'langchain/docstore';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

import { BaseCommand } from '../../baseCommand.js';
import { DataLoaderService } from '../../services/data-loader/data-loader.js';
import { IngestService } from '../../services/ingest/ingest.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';
import { TikTokenModelMapping } from '../../utils/tiktoken.js';

export default class Ingest extends BaseCommand<typeof Ingest> {
  static description = 'Ingest directory to a vector store';

  static examples = [
    '<%= config.bin %> <%= command.id %> --collection=foo --dir="./data"',
    '<%= config.bin %> <%= command.id %> --collection=foo --file="./shelly/README.md"',
    '<%= config.bin %> <%= command.id %> --collection=foo --file="./shelly/README.md" --dir="./data"',
    '<%= config.bin %> <%= command.id %> --collection=foo --dryRun --dir="./data"',
    '<%= config.bin %> <%= command.id %> --collection=foo --split --dir="./data"',
    '<%= config.bin %> <%= command.id %> --collection=foo --split --chunkSize=500 --chunkOverlap=50 --dir="./data"',
    '<%= config.bin %> <%= command.id %> --collection=foo --githubRepo="https://github.com/rpidanny/shelly"',
  ];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'Enable verbose mode',
    }),
    dryRun: Flags.boolean({
      char: 'D',
      description: "Enable dry run that doesn't ingest data",
    }),
    collection: Flags.string({
      char: 'c',
      description: 'Name of the collection to use',
      default: 'ShellyDefault',
    }),
    split: Flags.boolean({
      char: 's',
      description: 'Enable split of documents into chunks',
    }),
    chunkSize: Flags.integer({
      char: 't',
      description: 'The size of individual chunks. (Measured in tiktokens)',
      default: 400,
    }),
    chunkOverlap: Flags.integer({
      char: 'o',
      description: 'Number of tokens to overlap per chunk',
      default: 50,
    }),
    dir: Flags.string({
      char: 'd',
      description: 'Path of the directory to ingest',
      required: false,
    }),
    githubRepo: Flags.string({
      char: 'g',
      description: 'URL of a GitHub repo to ingest (https)',
      required: false,
    }),
    githubBranch: Flags.string({
      char: 'b',
      description: 'The git branch you want to ingest',
      required: false,
      default: 'main',
    }),
    file: Flags.string({
      char: 'f',
      description: 'Path of the file to ingest',
      required: false,
    }),
  };

  static args = {};

  public async run(): Promise<Document[]> {
    const {
      collection,
      verbose,
      chunkSize,
      chunkOverlap,
      split,
      dryRun,
      dir,
      file,
      githubRepo,
      githubBranch,
    } = this.flags;

    const service = await this.getIngestService(
      verbose,
      this.localConfig.openAi.chatModel
    );
    const dest = `${this.localConfig.vectorStore}/${collection}`;

    let docs: Document[] = [];

    if (file) {
      docs = await this.runIngestion('file', file, dest, docs, async () =>
        service.ingestFile(
          file,
          collection,
          split,
          chunkSize,
          chunkOverlap,
          dryRun
        )
      );
    }

    if (dir) {
      docs = await this.runIngestion('dir', dir, dest, docs, async () =>
        service.ingestDirectory(
          dir,
          collection,
          split,
          chunkSize,
          chunkOverlap,
          dryRun
        )
      );
    }

    if (githubRepo) {
      docs = await this.runIngestion(
        'github repo',
        githubRepo,
        dest,
        docs,
        async () =>
          service.ingestGitHubRepo(
            githubRepo,
            githubBranch,
            collection,
            split,
            chunkSize,
            chunkOverlap,
            dryRun
          )
      );
    }

    this.log(chalk.green(`Total documents: ${chalk.bold(docs.length)}`));
    await this.logTotalTokens(docs, this.localConfig.openAi.chatModel);

    return docs;
  }

  async getIngestService(
    verbose: boolean,
    llmModelName: string
  ): Promise<IngestService> {
    const vectorStoreService = new VectorStoreService(this.localConfig);
    const dataLoaderService = new DataLoaderService(llmModelName, verbose);
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

    return new IngestService({
      dataLoaderService,
      vectorStoreService,
      embeddings,
    });
  }

  private async runIngestion(
    type: string,
    src: string,
    dest: string,
    docs: Document[],
    ingestFn: () => Promise<Document[]>
  ) {
    ux.action.start(
      `Ingesting ${type}: ${chalk.magentaBright(src)} into ${chalk.yellowBright(
        dest
      )}`
    );
    docs = docs.concat(await ingestFn());
    ux.action.stop();
    return docs;
  }

  private async logTotalTokens(docs: Document[], llmModelName: string) {
    const encoder = tiktoken.get_encoding(
      TikTokenModelMapping[llmModelName] as TiktokenEncoding
    );

    const totalTokens = docs.reduce(
      (acc, doc) => acc + encoder.encode(doc.pageContent).length,
      0
    );

    // cost of text-embedding-ada-002 (0.0004 per 1k token)
    const estimatedCost = totalTokens * (0.0004 / 1000);

    this.log(
      chalk.green(
        `Total tokens: ${chalk.bold(totalTokens)} ${chalk.italic.gray(
          `(estimated cost $${estimatedCost}))`
        )}`
      )
    );

    encoder.free();
  }
}
