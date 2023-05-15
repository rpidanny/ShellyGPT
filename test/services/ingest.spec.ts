import { mock } from 'jest-mock-extended';
import { Document } from 'langchain/document';
import { Embeddings } from 'langchain/embeddings';

import { DataLoaderService } from '../../src/services/data-loader/data-loader';
import {
  IIngestServiceDependencies,
  IngestService,
} from '../../src/services/ingest';
import { VectorStoreService } from '../../src/services/vector-store/vector-store.service';

describe('IngestService', () => {
  const docs: Document[] = [{ pageContent: 'some text', metadata: {} }];

  let dependencies: IIngestServiceDependencies;
  let ingestService: IngestService;

  beforeEach(() => {
    dependencies = {
      dataLoaderService: mock<DataLoaderService>({
        loadDirectory: jest.fn().mockResolvedValue(docs),
        loadFile: jest.fn().mockResolvedValue(docs),
        loadGitHubRepo: jest.fn().mockResolvedValue(docs),
      }),
      vectorStoreService: mock<VectorStoreService>(),
      embeddings: mock<Embeddings>(),
    };
    ingestService = new IngestService(dependencies);
  });

  describe('ingestDirectory', () => {
    it('should call dataLoaderService.loadDirectory and vectorStoreService.storeDocuments with the correct arguments', async () => {
      const dirPath = '/path/to/dir';
      const collection = 'collection';
      const split = true;
      const chunkSize = 400;
      const chunkOverlap = 50;

      const result = await ingestService.ingestDirectory(
        dirPath,
        collection,
        split,
        chunkSize,
        chunkOverlap,
        false
      );

      expect(result).toEqual(docs);
      expect(dependencies.dataLoaderService.loadDirectory).toHaveBeenCalledWith(
        dirPath,
        split,
        chunkSize,
        chunkOverlap
      );
      expect(
        dependencies.vectorStoreService.storeDocuments
      ).toHaveBeenCalledWith(docs, dependencies.embeddings, collection);
    });

    it('should return the result of dataLoaderService.loadDirectory and not call vectorStoreService.storeDocuments when dryRun is true', async () => {
      const result = await ingestService.ingestDirectory(
        '/path/to/dir',
        'collection',
        true,
        400,
        50,
        true
      );

      expect(result).toEqual(docs);
      expect(
        dependencies.dataLoaderService.loadDirectory
      ).toHaveBeenCalledTimes(1);
      expect(dependencies.vectorStoreService.storeDocuments).not.toBeCalled();
    });
  });

  describe('ingestFile', () => {
    it('should call dataLoaderService.loadFile and vectorStoreService.storeDocuments with the correct arguments', async () => {
      const filePath = '/path/to/file';
      const collection = 'collection';
      const split = true;
      const chunkSize = 400;
      const chunkOverlap = 50;

      const result = await ingestService.ingestFile(
        filePath,
        collection,
        split,
        chunkSize,
        chunkOverlap,
        false
      );

      expect(result).toEqual(docs);
      expect(dependencies.dataLoaderService.loadFile).toHaveBeenCalledWith(
        filePath,
        split,
        chunkSize,
        chunkOverlap
      );
      expect(
        dependencies.vectorStoreService.storeDocuments
      ).toHaveBeenCalledWith(docs, dependencies.embeddings, collection);
    });

    it('should return the result of dataLoaderService.loadFile and and not call vectorStoreService.storeDocuments when dryRun is true', async () => {
      const result = await ingestService.ingestFile(
        '/path/to/file',
        'collection',
        true,
        400,
        50,
        true
      );

      expect(result).toEqual(docs);
      expect(dependencies.dataLoaderService.loadFile).toHaveBeenCalledTimes(1);
      expect(dependencies.vectorStoreService.storeDocuments).not.toBeCalled();
    });
  });

  describe('ingestGitHubRepo', () => {
    it('should call dataLoaderService.loadGitHubRepo and vectorStoreService.storeDocuments with the correct arguments', async () => {
      const repo = 'my/repo';
      const branch = 'main';
      const collection = 'collection';
      const split = true;
      const chunkSize = 400;
      const chunkOverlap = 50;

      const result = await ingestService.ingestGitHubRepo(
        repo,
        branch,
        'collection',
        split,
        chunkSize,
        chunkOverlap,
        false
      );

      expect(result).toEqual(docs);
      expect(
        dependencies.dataLoaderService.loadGitHubRepo
      ).toHaveBeenCalledWith(repo, branch, split, chunkSize, chunkOverlap);
      expect(
        dependencies.vectorStoreService.storeDocuments
      ).toHaveBeenCalledWith(docs, dependencies.embeddings, collection);
    });

    it('should return the result of dataLoaderService.loadGitHubRepo and not call vectorStoreService.storeDocuments when dryRun is true', async () => {
      const result = await ingestService.ingestGitHubRepo(
        'my/repo',
        'main',
        'collection',
        true,
        400,
        50,
        true
      );

      expect(result).toEqual(docs);
      expect(
        dependencies.dataLoaderService.loadGitHubRepo
      ).toHaveBeenCalledTimes(1);
      expect(dependencies.vectorStoreService.storeDocuments).not.toBeCalled();
    });
  });
});
