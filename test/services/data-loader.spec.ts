// eslint-disable-next-line camelcase
import { get_encoding, Tiktoken } from '@dqbd/tiktoken';
import { Document } from 'langchain/document';

import { DataLoaderService } from '../../src/services/data-loader/data-loader.service.js';

describe('DataLoaderService', () => {
  const rootPath = './test/data';
  const dataPath = `${rootPath}/supported`;
  const unsupportedDataPath = `${rootPath}/unsupported`;

  let dataLoaderService: DataLoaderService;
  let encoding: Tiktoken;

  beforeEach(() => {
    dataLoaderService = new DataLoaderService();
    encoding = get_encoding('cl100k_base');
  });

  describe('loadDirectory', () => {
    test(`should load directory with default options`, async () => {
      const documents = await dataLoaderService.loadDirectory(dataPath);

      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toBeGreaterThan(0);

      for (const document of documents) {
        expect(document).toBeInstanceOf(Document);
        expect(document.pageContent).toBeDefined();
        expect(document.pageContent.length).toBeGreaterThan(0);
        expect(document.pageContent).not.toBe('');
        expect(encoding.encode(document.pageContent).length).toBeLessThan(450);
      }
    });

    it('should load and split documents from directory with custom options', async () => {
      // arrange
      const split = true;
      const chunkSize = 200;
      const chunkOverlap = 100;

      // act
      const documents = await dataLoaderService.loadDirectory(
        dataPath,
        split,
        chunkSize,
        chunkOverlap
      );

      // assert
      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toBeGreaterThan(0);

      for (const document of documents) {
        expect(document).toBeInstanceOf(Document);
        expect(document.pageContent).toBeDefined();
        expect(document.pageContent.length).toBeGreaterThan(0);
        expect(document.pageContent).not.toBe('');
        expect(encoding.encode(document.pageContent).length).toBeLessThan(
          chunkSize + chunkOverlap
        );
      }
    });

    it('should load from directory and not split documents', async () => {
      // arrange
      const split = false;

      // act
      const documents = await dataLoaderService.loadDirectory(dataPath, split);

      // assert
      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toBeGreaterThan(0);

      for (const document of documents) {
        expect(document).toBeInstanceOf(Document);
        expect(document.pageContent).toBeDefined();
        expect(document.pageContent.length).toBeGreaterThan(0);
        expect(document.pageContent).not.toBe('');
        expect(encoding.encode(document.pageContent).length).toBeGreaterThan(
          500
        );
      }
    });

    it('should handle loading documents with unsupported file extensions gracefully', async () => {
      // act
      const documents = await dataLoaderService.loadDirectory(
        unsupportedDataPath
      );

      // assert
      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toBe(0);
    });
  });
});
