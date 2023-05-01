import { RetrievalQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { Embeddings } from 'langchain/embeddings';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BaseLLM } from 'langchain/llms';
import { OpenAIChat } from 'langchain/llms/openai';

import { TConfig } from '../../config/schema.js';
import { IModelOptions, IShellyDependencies } from './interfaces.js';

export class ShellyService {
  private embeddings!: Embeddings;

  constructor(
    private readonly dependencies: IShellyDependencies,
    private readonly config: TConfig,
    private readonly verbose = false
  ) {
    this.embeddings = new OpenAIEmbeddings({
      verbose: this.verbose,
      openAIApiKey: this.config.openAi.apiKey,
      modelName: this.config.openAi.embeddingsModel,
    });
  }

  getEmbeddings(): Embeddings {
    return this.embeddings;
  }

  getLLM({
    temperature = 1e-10,
    maxTokens = 2048,
  }: IModelOptions = {}): BaseLLM {
    return new OpenAIChat({
      openAIApiKey: this.config.openAi.apiKey,
      modelName: this.config.openAi.chatModel,
      verbose: this.verbose,
      temperature,
      maxTokens,
    });
  }

  async ask(
    question: string,
    collection: string,
    modelOptions: IModelOptions = {}
  ): Promise<string> {
    const vectorStore =
      await this.dependencies.vectorStoreService.getVectorStore(
        this.embeddings,
        collection
      );

    const llm = this.getLLM(modelOptions);

    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());

    const { text } = await chain.call({
      query: question,
    });

    return text;
  }

  async ingestDirectory(
    dirPath: string,
    collection: string,
    split = true,
    chunkSize = 400,
    chunkOverlap = 50,
    dryRun = false
  ): Promise<Document[]> {
    const docs = await this.dependencies.dataLoaderService.loadDirectory(
      dirPath,
      split,
      chunkSize,
      chunkOverlap
    );

    if (dryRun) return docs;

    await this.dependencies.vectorStoreService.storeDocuments(
      docs,
      this.embeddings,
      collection
    );

    return docs;
  }

  async ingestFile(
    filePath: string,
    collection: string,
    split = true,
    chunkSize = 400,
    chunkOverlap = 50,
    dryRun = false
  ): Promise<Document[]> {
    const docs = await this.dependencies.dataLoaderService.loadFile(
      filePath,
      split,
      chunkSize,
      chunkOverlap
    );

    if (dryRun) return docs;

    await this.dependencies.vectorStoreService.storeDocuments(
      docs,
      this.embeddings,
      collection
    );

    return docs;
  }

  async ingestGitHubRepo(
    repo: string,
    branch: string,
    collection: string,
    split = true,
    chunkSize = 400,
    chunkOverlap = 50,
    dryRun = false
  ): Promise<Document[]> {
    const docs = await this.dependencies.dataLoaderService.loadGitHubRepo(
      repo,
      branch,
      split,
      chunkSize,
      chunkOverlap
    );

    if (dryRun) return docs;

    await this.dependencies.vectorStoreService.storeDocuments(
      docs,
      this.embeddings,
      collection
    );

    return docs;
  }
}
