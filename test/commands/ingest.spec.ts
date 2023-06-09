import { mock } from 'jest-mock-extended';
import { Document } from 'langchain/document';

import Ingest from '../../src/commands/ingest/index.js';
import { OpenAIChatModel } from '../../src/config/enums.js';
import { IngestService } from '../../src/services/ingest';
import { getMockConfig } from '../fixtures/config';

describe('Ingest command', () => {
  const mockConfig = getMockConfig();
  const docs: Document[] = [
    {
      pageContent: 'some-text',
      metadata: {},
    },
  ];

  let mockIngestService: IngestService;
  beforeEach(() => {
    mockIngestService = mock<IngestService>({
      ingestFile: jest.fn().mockResolvedValue(docs),
      ingestDirectory: jest.fn().mockResolvedValue(docs),
      ingestGitHubRepo: jest.fn().mockResolvedValue(docs),
    });

    // Disable spam from console.log
    jest.spyOn(process.stderr, 'write').mockImplementation();
    jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('File', () => {
    beforeEach(() => {
      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);
    });

    test.each`
      verbose      | collection           | split        | chunkSize    | chunkOverlap | dryRun
      ${undefined} | ${undefined}         | ${undefined} | ${undefined} | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${undefined} | ${100}       | ${10}        | ${undefined}
      ${true}      | ${'some-collection'} | ${true}      | ${100}       | ${10}        | ${true}
    `(
      'should call IngestService.ask with the correct flags ($verbose, $collection, $split, $chunkSize, $chunkOverlap, $dryRun) and args',
      async ({
        verbose,
        collection,
        split,
        chunkSize,
        chunkOverlap,
        dryRun,
      }) => {
        const stdoutSpy = jest
          .spyOn(process.stdout, 'write')
          .mockImplementation();

        const filePath = '/home/rpidanny/data/file.txt';
        const args = [
          ...(collection ? ['--collection', collection] : []),
          ...(verbose ? ['--verbose'] : []),
          ...(split ? ['--split'] : []),
          ...(chunkSize ? ['--chunkSize', `${chunkSize}`] : []),
          ...(chunkOverlap ? ['--chunkOverlap', `${chunkOverlap}`] : []),
          ...(dryRun ? ['--dryRun'] : []),
          ...[`--file`, filePath],
        ];

        const ingestCommand = new Ingest(args, mockConfig);
        await ingestCommand.init();

        const answer = await ingestCommand.run();

        expect(answer).toEqual(docs);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledTimes(1);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledWith(
          verbose,
          OpenAIChatModel.GPT_3_5_TURBO
        );
        expect(mockIngestService.ingestFile).toHaveBeenCalledTimes(1);
        expect(mockIngestService.ingestFile).toHaveBeenCalledWith(
          filePath,
          collection ?? 'ShellyDefault',
          split,
          chunkSize ?? 400,
          chunkOverlap ?? 50,
          dryRun
        );
        expect(stdoutSpy).toHaveBeenNthCalledWith(
          1,
          expect.stringMatching('Total documents:')
        );
      }
    );

    it('should throw error when ingest fails', async () => {
      const error = new Error('Some error');
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(process.stderr, 'write').mockImplementation();
      jest.spyOn(process.stdout, 'write').mockImplementation();

      const mockIngestService = mock<IngestService>({
        ingestFile: jest.fn().mockRejectedValue(error),
      });

      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);

      const filePath = '/home/rpidanny/data/file.txt';
      const args = [`--file`, filePath];

      const ingestCommand = new Ingest(args, mockConfig);

      await ingestCommand.init();

      await expect(ingestCommand.run()).rejects.toThrowError(error);

      expect(mockIngestService.ingestFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Directory', () => {
    beforeEach(() => {
      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);
    });

    test.each`
      verbose      | collection           | split        | chunkSize    | chunkOverlap | dryRyn
      ${undefined} | ${undefined}         | ${undefined} | ${undefined} | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${undefined} | ${100}       | ${10}        | ${undefined}
      ${true}      | ${'some-collection'} | ${true}      | ${100}       | ${10}        | ${true}
    `(
      'should call IngestService.ask with the correct flags ($verbose, $collection, $split, $chunkSize, $chunkOverlap, $dryRun) and args',
      async ({
        verbose,
        collection,
        split,
        chunkSize,
        chunkOverlap,
        dryRun,
      }) => {
        const stdoutSpy = jest
          .spyOn(process.stdout, 'write')
          .mockImplementation();

        const dir = '/home/rpidanny/data';
        const args = [
          ...(collection ? ['--collection', collection] : []),
          ...(verbose ? ['--verbose'] : []),
          ...(split ? ['--split'] : []),
          ...(chunkSize ? ['--chunkSize', `${chunkSize}`] : []),
          ...(chunkOverlap ? ['--chunkOverlap', `${chunkOverlap}`] : []),
          ...(dryRun ? ['--dryRun'] : []),
          ...[`--dir`, dir],
        ];

        const ingestCommand = new Ingest(args, mockConfig);
        await ingestCommand.init();

        const answer = await ingestCommand.run();

        expect(answer).toEqual(docs);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledTimes(1);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledWith(
          verbose,
          OpenAIChatModel.GPT_3_5_TURBO
        );
        expect(mockIngestService.ingestDirectory).toHaveBeenCalledTimes(1);
        expect(mockIngestService.ingestDirectory).toHaveBeenCalledWith(
          dir,
          collection ?? 'ShellyDefault',
          split,
          chunkSize ?? 400,
          chunkOverlap ?? 50,
          dryRun
        );
        expect(stdoutSpy).toHaveBeenNthCalledWith(
          1,
          expect.stringMatching('Total documents')
        );
      }
    );

    it('should throw error when ingest fails', async () => {
      const error = new Error('Some error');
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(process.stderr, 'write').mockImplementation();
      jest.spyOn(process.stdout, 'write').mockImplementation();

      const mockIngestService = mock<IngestService>({
        ingestDirectory: jest.fn().mockRejectedValue(error),
      });

      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);

      const dir = '/home/rpidanny/data';
      const args = [`--dir`, dir];

      const ingestCommand = new Ingest(args, mockConfig);

      await ingestCommand.init();

      await expect(ingestCommand.run()).rejects.toThrowError(error);

      expect(mockIngestService.ingestDirectory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Github', () => {
    const repo = '/home/rpidanny/data';

    beforeEach(() => {
      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);
    });

    test.each`
      verbose      | collection           | split        | chunkSize    | chunkOverlap | dryRyn       | githubBranch
      ${undefined} | ${undefined}         | ${undefined} | ${undefined} | ${undefined} | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${undefined} | ${100}       | ${10}        | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${true}      | ${100}       | ${10}        | ${true}      | ${'test'}
    `(
      'should call IngestService.ask with the correct flags ($verbose, $collection, $split, $chunkSize, $chunkOverlap, $dryRun, $githubBranch) and args',
      async ({
        verbose,
        collection,
        split,
        chunkSize,
        chunkOverlap,
        dryRun,
        githubBranch,
      }) => {
        const stdoutSpy = jest
          .spyOn(process.stdout, 'write')
          .mockImplementation();

        const args = [
          ...(collection ? ['--collection', collection] : []),
          ...(verbose ? ['--verbose'] : []),
          ...(split ? ['--split'] : []),
          ...(chunkSize ? ['--chunkSize', `${chunkSize}`] : []),
          ...(chunkOverlap ? ['--chunkOverlap', `${chunkOverlap}`] : []),
          ...(dryRun ? ['--dryRun'] : []),
          ...[`--githubRepo`, repo],
          ...(githubBranch ? ['--githubBranch', githubBranch] : []),
        ];

        const ingestCommand = new Ingest(args, mockConfig);
        await ingestCommand.init();

        const answer = await ingestCommand.run();

        expect(answer).toEqual(docs);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledTimes(1);
        expect(Ingest.prototype.getIngestService).toHaveBeenCalledWith(
          verbose,
          OpenAIChatModel.GPT_3_5_TURBO
        );
        expect(mockIngestService.ingestGitHubRepo).toHaveBeenCalledTimes(1);
        expect(mockIngestService.ingestGitHubRepo).toHaveBeenCalledWith(
          repo,
          githubBranch ?? 'main',
          collection ?? 'ShellyDefault',
          split,
          chunkSize ?? 400,
          chunkOverlap ?? 50,
          dryRun
        );
        expect(stdoutSpy).toHaveBeenNthCalledWith(
          1,
          expect.stringMatching('Total documents:')
        );
      }
    );

    it('should throw error when ingest fails', async () => {
      const error = new Error('Some error');
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(process.stderr, 'write').mockImplementation();
      jest.spyOn(process.stdout, 'write').mockImplementation();

      const mockIngestService = mock<IngestService>({
        ingestGitHubRepo: jest.fn().mockRejectedValue(error),
      });

      jest
        .spyOn(Ingest.prototype, 'getIngestService')
        .mockResolvedValueOnce(mockIngestService);

      const args = [`--githubRepo`, repo];

      const ingestCommand = new Ingest(args, mockConfig);
      await ingestCommand.init();

      await expect(ingestCommand.run()).rejects.toThrowError(error);

      expect(mockIngestService.ingestGitHubRepo).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIngestService', () => {
    it('should create and return a new instance of IngestService', async () => {
      const filePath = '/home/rpidanny/data/file.txt';
      const args = [...['--collection', 'collection'], ...[`--file`, filePath]];

      const ingestCommand = new Ingest(args, mockConfig);
      await ingestCommand.init();

      const service = await ingestCommand.getIngestService(
        false,
        OpenAIChatModel.GPT_3_5_TURBO
      );

      expect(service).toBeInstanceOf(IngestService);
    });
  });
});
