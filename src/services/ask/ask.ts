import { RetrievalQAChain } from 'langchain/chains';

import { IAskServiceDependencies } from './interfaces.js';

export class AskService {
  constructor(private readonly dependencies: IAskServiceDependencies) {}

  async askAboutCollection(
    question: string,
    collection: string
  ): Promise<string> {
    const vectorStore =
      await this.dependencies.vectorStoreService.getVectorStore(
        this.dependencies.embeddings,
        collection
      );

    const chain = RetrievalQAChain.fromLLM(
      this.dependencies.llm,
      vectorStore.asRetriever()
    );

    const { text } = await chain.call({
      query: question,
    });

    return text;
  }
}
