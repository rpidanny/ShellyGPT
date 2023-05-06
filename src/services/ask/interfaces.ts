import { Embeddings } from 'langchain/embeddings';
import { LLM } from 'langchain/llms/base';

import { VectorStoreService } from '../vector-store/vector-store.service.js';

export interface IAskServiceDependencies {
  llm: LLM;
  embeddings: Embeddings;
  vectorStoreService: VectorStoreService;
}
