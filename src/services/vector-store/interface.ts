import { Document } from 'langchain/document';
import { Embeddings } from 'langchain/embeddings';
import { VectorStore } from 'langchain/vectorstores';

import { VectorStores } from './enums.js';

export interface IPineconeConfig {
  apiKey: string;
  environment: string;
}

export interface IMilvusConfig {
  url: string;
  username: string;
  password: string;
}

export interface IVectorStoreConfig {
  vectorStore: VectorStores;
  pinecone?: IPineconeConfig;
  milvus?: IMilvusConfig;
}

export interface IVectorStoreService {
  init(): Promise<void>;

  storeDocuments(
    docs: Document[],
    embeddings: Embeddings,
    collection: string
  ): Promise<VectorStore>;

  getVectorStore(
    embeddings: Embeddings,
    collection: string
  ): Promise<VectorStore>;
}
