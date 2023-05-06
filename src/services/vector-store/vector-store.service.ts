import { PineconeClient } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import { Embeddings } from 'langchain/embeddings';
import { VectorStore } from 'langchain/vectorstores';
import { Milvus } from 'langchain/vectorstores/milvus';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

import { VectorStores } from '../../config/enums.js';
import { IVectorStoreConfig } from './interface.js';

export class VectorStoreService {
  constructor(private readonly config: IVectorStoreConfig) {}

  async storeDocuments(
    docs: Document[],
    embeddings: Embeddings,
    collection: string
  ): Promise<VectorStore> {
    switch (this.config.vectorStore) {
      case VectorStores.PineCone:
        return this.ingestIntoPinecone(docs, embeddings, collection);
      case VectorStores.Milvus:
        return this.ingestIntoMilvus(docs, embeddings, collection);
      default:
        throw Error('Invalid vector store set');
    }
  }

  async getVectorStore(
    embeddings: Embeddings,
    collection: string
  ): Promise<VectorStore> {
    switch (this.config.vectorStore) {
      case VectorStores.PineCone:
        return this.getPineconeStore(embeddings, collection);
      case VectorStores.Milvus:
        return this.getMilvusStore(embeddings, collection);
      default:
        throw Error('Invalid vector store set');
    }
  }

  private async getMilvusStore(
    embeddings: Embeddings,
    collection: string
  ): Promise<Milvus> {
    if (!this.config.milvus) {
      throw new Error('Milvus configuration missing');
    }

    return Milvus.fromExistingCollection(embeddings, {
      collectionName: collection,
      url: this.config.milvus?.url,
      username: this.config?.milvus?.username,
      password: this.config.milvus.password,
    });
  }

  private async getPineconeStore(
    embeddings: Embeddings,
    collection: string
  ): Promise<PineconeStore> {
    if (!this.config.pinecone) {
      throw new Error('Pinecone configuration missing');
    }

    try {
      const client = new PineconeClient();
      await client.init({
        apiKey: this.config.pinecone.apiKey,
        environment: this.config.pinecone.environment,
      });
      const pineconeIndex = client.Index(collection);
      return PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  private async ingestIntoMilvus(
    docs: Document[],
    embeddings: Embeddings,
    collection: string
  ): Promise<Milvus> {
    if (!this.config.milvus) {
      throw new Error('Milvus configuration missing');
    }

    return Milvus.fromDocuments(docs, embeddings, {
      collectionName: collection,
      url: this.config.milvus?.url,
      username: this.config?.milvus?.username,
      password: this.config.milvus.password,
    });
  }

  private async ingestIntoPinecone(
    docs: Document[],
    embeddings: Embeddings,
    collection: string
  ): Promise<PineconeStore> {
    if (!this.config.pinecone) {
      throw new Error('Pinecone configuration missing');
    }
    try {
      const client = new PineconeClient();
      await client.init({
        apiKey: this.config.pinecone.apiKey,
        environment: this.config.pinecone.environment,
      });
      const pineconeIndex = client.Index(collection);
      return PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
      });
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}
