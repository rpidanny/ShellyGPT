/* eslint-disable camelcase */
import { z } from 'zod';

import {
  OpenAIChatModel,
  OpenAIEmbeddingsModel,
  VectorStores,
} from './enums.js';

const OpenAIConfigSchema = z.object({
  apiKey: z.string({
    required_error: 'OpenAI API Key is required',
    invalid_type_error: 'OpenAI API Key must be a string',
  }),
  chatModel: z.nativeEnum(OpenAIChatModel),
  embeddingsModel: z.nativeEnum(OpenAIEmbeddingsModel),
});

const PineconeConfigSchema = z.object({
  apiKey: z.string({
    required_error: 'Pinecone API Key is required',
    invalid_type_error: 'Pinecone API Key must be a string',
  }),
  environment: z.string({
    required_error: 'Pinecone environment is required',
    invalid_type_error: 'Pinecone environment must be a string',
  }),
});

const MilvusConfigSchema = z.object({
  url: z.string({
    required_error: 'Milvus URL is required',
    invalid_type_error: 'Milvus URL must be a string',
  }),
  username: z.string({
    required_error: 'Milvus database username',
  }),
  password: z.string({
    required_error: 'Milvus database password',
  }),
});

export const ConfigSchema = z
  .object({
    openAi: OpenAIConfigSchema,
    vectorStore: z.nativeEnum(VectorStores),
    pinecone: PineconeConfigSchema.optional(),
    milvus: MilvusConfigSchema.optional(),
  })
  .refine(
    (config) => {
      if (config.vectorStore === VectorStores.Milvus) {
        return config.milvus !== undefined;
      }
      return true;
    },
    {
      message: 'Milvus configuration not set',
    }
  )
  .refine(
    (config) => {
      if (config.vectorStore === VectorStores.PineCone) {
        return config.pinecone !== undefined;
      }
      return true;
    },
    {
      message: 'Pinecone configuration not set',
    }
  );

export type TConfig = z.infer<typeof ConfigSchema>;
