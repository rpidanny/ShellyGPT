import { Config } from '@oclif/core';
import path from 'path';

import {
  OpenAIChatModel,
  OpenAIEmbeddingsModel,
  VectorStores,
} from '../../src/config/enums.js';
import { TConfig } from '../../src/config/schema.js';

export function getMockLocalConfig(overrides?: Partial<TConfig>): TConfig {
  return {
    openAi: {
      apiKey: 'some-key',
      chatModel: OpenAIChatModel.GPT_3_5_TURBO,
      embeddingsModel: OpenAIEmbeddingsModel.TextEmbeddingAda002,
    },
    vectorStore: VectorStores.Milvus,
    milvus: {
      url: 'http://localhost:19530',
      password: 'some-pw',
      username: 'some-user',
    },
    pinecone: {
      apiKey: 'some-other-key',
      environment: 'some-env',
    },
    ...overrides,
  };
}

export function getMockConfig(): Config {
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });
  mockConfig.configDir = path.join(process.cwd(), './test/data/configs');
  mockConfig.dataDir = path.join(process.cwd(), './test/data');

  return mockConfig;
}
