import { Embeddings } from 'langchain/embeddings';

import { DataLoaderService } from '../data-loader/data-loader.service.js';
import { VectorStoreService } from '../vector-store/vector-store.service.js';

export interface IIngestServiceDependencies {
  vectorStoreService: VectorStoreService;
  dataLoaderService: DataLoaderService;
  embeddings: Embeddings;
}
