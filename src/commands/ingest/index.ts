import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { Document } from 'langchain/docstore';

import { BaseCommand } from '../../baseCommand.js';
import { DataLoaderService } from '../../services/data-loader/data-loader.service.js';
import { ShellyService } from '../../services/shelly/shelly.service.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';

export default class Ingest extends BaseCommand<typeof Ingest> {
  static description = 'Ingest directory to a vector store';

  static examples = [
    '<%= config.bin %> <%= command.id %> --collection=foo --dir="./data"',
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
      githubRepo,
      githubBranch,
    } = this.flags;

    ux.action.start(
      `Ingesting ${dir || githubRepo} into ${
        this.localConfig.vectorStore
      }/${collection}`
    );

    const shelly = await this.getShelly(verbose);

    let docs: Document[] = [];

    if (dir) {
      docs = docs.concat(
        await shelly.ingestDirectory(
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
      docs = docs.concat(
        await shelly.ingestGitHubRepo(
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

    ux.action.stop();
    this.log(chalk.green(`Ingested ${docs.length} documents`));
    return docs;
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
}
