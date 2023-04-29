import { TConfig } from '../../src/config/schema.js';
import {
  OpenAIChatModel,
  OpenAIEmbeddingsModel,
} from '../../src/services/shelly/enums.js';
import { VectorStores } from '../../src/services/vector-store/enums.js';

export function getMockConfig(overrides?: Partial<TConfig>): TConfig {
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
