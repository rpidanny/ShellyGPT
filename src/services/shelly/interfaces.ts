import { DataLoaderService } from '../data-loader/data-loader.service.js';
import { VectorStoreService } from '../vector-store/vector-store.service.js';

export interface IShellyDependencies {
  vectorStoreService: VectorStoreService;
  dataLoaderService: DataLoaderService;
}

export interface IModelOptions {
  temperature?: number;
  maxTokens?: number;
}
