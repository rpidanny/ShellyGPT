import { Document } from 'langchain/document';

import { IIngestServiceDependencies } from './interfaces.js';

export class IngestService {
  constructor(private readonly dependencies: IIngestServiceDependencies) {}

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
      this.dependencies.embeddings,
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
      this.dependencies.embeddings,
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
      this.dependencies.embeddings,
      collection
    );

    return docs;
  }
}
