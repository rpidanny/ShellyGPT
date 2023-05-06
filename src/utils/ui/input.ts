import { ux } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';

import {
  OpenAIChatModel,
  OpenAIEmbeddingsModel,
  VectorStores,
} from '../../config/enums.js';
import { TConfig } from '../../config/schema.js';

type PromptConfig<T> = {
  name: string;
  message: string;
  type: string;
  choices?: Array<any>;
  default?: T;
};

async function promptWithOptions<T>(config: PromptConfig<T>): Promise<T> {
  const { answer } = await inquirer.prompt<{ answer: T }>([
    {
      ...config,
      name: 'answer',
    },
  ]);
  return answer;
}

async function promptOpenAiConfig(
  defaultConfig?: TConfig['openAi']
): Promise<TConfig['openAi']> {
  const openAi: TConfig['openAi'] = {
    apiKey: await ux.prompt(chalk.bold('Enter OpenAI API Key'), {
      default: defaultConfig?.apiKey,
    }),
    chatModel: await promptWithOptions<OpenAIChatModel>({
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

async function promptVectorStoreConfig(
  defaultConfig?: TConfig['vectorStore']
): Promise<TConfig['vectorStore']> {
  return promptWithOptions<TConfig['vectorStore']>({
    name: 'vectorStore',
    message: 'select a vector store to use',
    type: 'list',
    choices: Object.values(VectorStores).map((name) => ({ name })),
    default: defaultConfig,
  });
}

async function promptMilvusConfig(
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

async function promptPineconeConfig(
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

export default {
  promptWithOptions,
  promptOpenAiConfig,
  promptVectorStoreConfig,
  promptMilvusConfig,
  promptPineconeConfig,
};
