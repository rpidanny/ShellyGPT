import { Command, ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';

import { TConfig } from '../../config/schema.js';
import {
  OpenAIChatModel,
  OpenAIEmbeddingsModel,
} from '../../services/shelly/enums.js';
import { VectorStores } from '../../services/vector-store/enums.js';

type PromptConfig<T> = {
  name: string;
  message: string;
  type: string;
  choices?: Array<any>;
  default?: T;
};

export default class Configure extends Command {
  static description = 'Configure shelly';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  private async getExistingConfig(
    configFilePath: string
  ): Promise<TConfig | null> {
    try {
      const config = await fs.readJSON(configFilePath);
      return config as TConfig;
    } catch (err) {
      return null;
    }
  }

  private async saveConfig(
    configFilePath: string,
    config: TConfig
  ): Promise<void> {
    await fs.ensureFile(configFilePath);
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2));
  }

  private async promptWithOptions<T>(config: PromptConfig<T>): Promise<T> {
    const { answer } = await inquirer.prompt<{ answer: T }>([
      {
        ...config,
        name: 'answer',
      },
    ]);
    return answer;
  }

  private async promptOpenAiConfig(
    defaultConfig?: TConfig['openAi']
  ): Promise<TConfig['openAi']> {
    const openAi: TConfig['openAi'] = {
      apiKey: await ux.prompt(chalk.bold('Enter OpenAI API Key'), {
        default: defaultConfig?.apiKey,
      }),
      chatModel: await this.promptWithOptions<OpenAIChatModel>({
        name: 'model',
        message: 'Select OpenAI default chat model',
        type: 'list',
        choices: Object.values(OpenAIChatModel).map((name) => ({ name })),
        default: defaultConfig?.chatModel,
      }),
      embeddingsModel: OpenAIEmbeddingsModel.TextEmbeddingAda002,
    };
    return openAi;
  }

  private async promptVectorStoreConfig(
    defaultConfig?: TConfig['vectorStore']
  ): Promise<TConfig['vectorStore']> {
    return this.promptWithOptions<TConfig['vectorStore']>({
      name: 'vectorStore',
      message: 'select a vector store to use',
      type: 'list',
      choices: Object.values(VectorStores).map((name) => ({ name })),
      default: defaultConfig,
    });
  }

  private async promptMilvusConfig(
    defaultConfig?: TConfig['milvus']
  ): Promise<TConfig['milvus']> {
    const milvus = {
      url: await ux.prompt(chalk.bold('Enter Milvus URL'), {
        default: defaultConfig?.url ?? 'http://localhost:19530',
      }),
      username: await ux.prompt(chalk.bold('Enter Milvus username'), {
        default: defaultConfig?.username,
        required: false,
      }),
      password: await ux.prompt(chalk.bold('Enter Milvus password'), {
        default: defaultConfig?.password,
        required: false,
      }),
    };
    return milvus;
  }

  private async promptPineconeConfig(
    defaultConfig?: TConfig['pinecone']
  ): Promise<TConfig['pinecone']> {
    const pinecone = {
      apiKey: await ux.prompt(chalk.bold('Enter Pinecone API Key'), {
        type: 'hide',
        default: defaultConfig?.apiKey,
      }),
      environment: await ux.prompt(chalk.bold('Enter Pinecone environment'), {
        default: defaultConfig?.environment,
      }),
    };
    return pinecone;
  }

  public async run(): Promise<void> {
    const configFilePath = path.join(this.config.configDir, 'config.json');

    const existingConfig = await this.getExistingConfig(configFilePath);
    const openAi = await this.promptOpenAiConfig(existingConfig?.openAi);
    const vectorStore = await this.promptVectorStoreConfig(
      existingConfig?.vectorStore
    );

    const [milvus, pinecone] = await Promise.all([
      vectorStore === VectorStores.Milvus
        ? this.promptMilvusConfig(existingConfig?.milvus)
        : undefined,
      vectorStore === VectorStores.PineCone
        ? this.promptPineconeConfig(existingConfig?.pinecone)
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
}
