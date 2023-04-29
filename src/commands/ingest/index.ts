import { Args, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { Document } from 'langchain/docstore';

import { BaseCommand } from '../../baseCommand.js';
import { DataLoaderService } from '../../services/data-loader/data-loader.service.js';
import { ShellyService } from '../../services/shelly/shelly.service.js';
import { VectorStoreService } from '../../services/vector-store/vector-store.service.js';

export default class Ingest extends BaseCommand<typeof Ingest> {
  static description = 'Ingest directory to a vector store';

  static examples = [
    '<%= config.bin %> <%= command.id %> --collection=foo ./data',
    '<%= config.bin %> <%= command.id %> --collection=foo --dryRun ./data',
    '<%= config.bin %> <%= command.id %> --collection=foo --split ./data',
    '<%= config.bin %> <%= command.id %> --collection=foo --split --chunkSize=500 --chunkOverlap=50./data',
  ];

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'Enable verbose mode',
    }),
    dryRun: Flags.boolean({
      char: 'd',
      description: "Enable dry run that doesn't ingest data",
    }),
    collection: Flags.string({
      char: 'c',
      description: 'Name of the collection to use',
      default: 'ShellyDefault',
    }),
    split: Flags.boolean({
      char: 's',
      description: 'Wether to split documents into chunks or not',
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
  };

  static args = {
    dir: Args.string({ description: 'directory to ingest', required: true }),
  };

  public async run(): Promise<Document[]> {
    const { dir } = this.args;
    const { collection, verbose, chunkSize, chunkOverlap, split, dryRun } =
      this.flags;

    ux.action.start(
      `Ingesting ${dir} into ${this.localConfig.vectorStore}/${collection}`
    );

    const shelly = await this.getShelly(verbose);

    const docs = await shelly.ingestDirectory(
      dir,
      collection,
      split,
      chunkSize,
      chunkOverlap,
      dryRun
    );

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
