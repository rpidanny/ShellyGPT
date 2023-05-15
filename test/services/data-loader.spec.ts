// eslint-disable-next-line camelcase
import { get_encoding, Tiktoken } from '@dqbd/tiktoken';
import { Document } from 'langchain/document';

import { OpenAIChatModel } from '../../local_tests/factories/llm/enums';
import { DataLoaderService } from '../../src/services/data-loader/data-loader.service.js';

describe('DataLoaderService', () => {
  const rootPath = './test/data';
  const supportedDirPath = `${rootPath}/supported`;
  const supportedFilePath = `${supportedDirPath}/txt/dijkstra.txt`;
  const unsupportedDirPath = `${rootPath}/unsupported`;
  const unsupportedFilePath = `${unsupportedDirPath}/luddites.ai`;
  const githubRepo = 'https://github.com/rpidanny/alfred-repository';
  const githubBranch = 'master';

  let dataLoaderService: DataLoaderService;
  let encoding: Tiktoken;

  beforeAll(() => {
    // Disable spam from console.log
    jest.spyOn(process.stdout, 'write').mockImplementation();
    jest.spyOn(process.stderr, 'write').mockImplementation();
  });

  beforeEach(() => {
    dataLoaderService = new DataLoaderService(OpenAIChatModel.GPT_3_5_TURBO);
    encoding = get_encoding('cl100k_base');
  });

  it('should throw error when model is not supported', () => {
    expect(() => {
      new DataLoaderService('unsupported_model');
    }).toThrowError('Model unsupported_model is not supported');
  });

  describe('loadDirectory', () => {
    test(`should load directory with default options`, async () => {
      const documents = await dataLoaderService.loadDirectory(supportedDirPath);

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

    it('should load and split documents from directory with custom options', async () => {
      // arrange
      const split = true;
      const chunkSize = 200;
      const chunkOverlap = 100;

      // act
      const documents = await dataLoaderService.loadDirectory(
        supportedDirPath,
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
      const documents = await dataLoaderService.loadDirectory(
        supportedDirPath,
        split
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
        expect(encoding.encode(document.pageContent).length).toBeGreaterThan(
          500
        );
      }
    });

    it('should handle loading documents with unsupported file extensions gracefully', async () => {
      // act
      const documents = await dataLoaderService.loadDirectory(
        unsupportedDirPath
      );

      // assert
      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toBe(0);
    });
  });

  describe('loadFile', () => {
    test.each([
      `${supportedDirPath}/txt/dijkstra.txt`,
      `${supportedDirPath}/md/openai-evals.md`,
      `${supportedDirPath}/srt/the.big.bang.theory.s12e24.720p.bluray.srt`,
      unsupportedFilePath,
    ])(`should load %p with default options`, async (filePath) => {
      const documents = await dataLoaderService.loadFile(filePath);

      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toEqual(1);
      expect(documents[0]).toBeInstanceOf(Document);
      expect(documents[0].pageContent).toBeDefined();
      expect(documents[0].pageContent.length).toBeGreaterThan(0);
      expect(documents[0].pageContent).not.toBe('');
      expect(encoding.encode(documents[0].pageContent).length).toBeGreaterThan(
        500
      );
    });

    it('should load from file and split documents with custom options', async () => {
      // arrange
      const split = true;
      const chunkSize = 200;
      const chunkOverlap = 100;

      // act
      const documents = await dataLoaderService.loadFile(
        supportedFilePath,
        split,
        chunkSize,
        chunkOverlap
      );

      // assert
      expect(documents).toBeDefined();
      expect(documents).toBeInstanceOf(Array);
      expect(documents.length).toEqual(20);
      expect(documents[0]).toBeInstanceOf(Document);
      expect(documents[0].pageContent).toBeDefined();
      expect(documents[0].pageContent).not.toBe('');
      expect(encoding.encode(documents[0].pageContent).length).toBeLessThan(
        chunkSize + chunkOverlap
      );
    });

    it("should throw error when file doesn't exist", async () => {
      const filePath = `${supportedDirPath}/${Date.now()}.txt`;
      await expect(dataLoaderService.loadFile(filePath)).rejects.toThrow(
        `File doesn't exist: ${filePath}`
      );
    });
  });

  describe('loadGitHubRepo', () => {
    test(`should load github repo with default options`, async () => {
      // act
      const documents = await dataLoaderService.loadGitHubRepo(
        githubRepo,
        githubBranch
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
        expect(encoding.encode(document.pageContent).length).toBeLessThan(450);
      }
    });

    it('should load from directory and not split documents', async () => {
      // arrange
      const split = false;

      // act
      const documents = await dataLoaderService.loadGitHubRepo(
        githubRepo,
        githubBranch,
        split
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
        expect(encoding.encode(document.pageContent).length).toBeGreaterThan(
          119
        );
      }
    });
  });
});
