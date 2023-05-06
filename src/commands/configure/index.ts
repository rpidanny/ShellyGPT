import { Command } from '@oclif/core';
import fs from 'fs-extra';
import path from 'path';

import { VectorStores } from '../../config/enums.js';
import { TConfig } from '../../config/schema.js';
import uiInput from '../../utils/ui/input.js';

export default class Configure extends Command {
  static description = 'Configure shelly';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  public async run(): Promise<void> {
    const configFilePath = path.join(this.config.configDir, 'config.json');

    const existingConfig = await this.getExistingConfig(configFilePath);
    const openAi = await uiInput.promptOpenAiConfig(existingConfig?.openAi);
    const vectorStore = await uiInput.promptVectorStoreConfig(
      existingConfig?.vectorStore
    );

    const [milvus, pinecone] = await Promise.all([
      vectorStore === VectorStores.Milvus
        ? uiInput.promptMilvusConfig(existingConfig?.milvus)
        : undefined,
      vectorStore === VectorStores.PineCone
        ? uiInput.promptPineconeConfig(existingConfig?.pinecone)
        : undefined,
    ]);

    const config = {
      openAi,
      vectorStore,
      milvus,
      pinecone,
    };

    await this.saveConfig(configFilePath, config);
  }

  async getExistingConfig(configFilePath: string): Promise<TConfig | null> {
    try {
      const config = await fs.readJSON(configFilePath);
      return config as TConfig;
    } catch (err) {
      return null;
    }
  }

  async saveConfig(configFilePath: string, config: TConfig): Promise<void> {
    await fs.ensureFile(configFilePath);
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2));
  }
}
