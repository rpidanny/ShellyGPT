import { Config } from '@oclif/core';
import { mock } from 'jest-mock-extended';
import { Document } from 'langchain/document';
import path from 'path';

import Ingest from '../../src/commands/ingest/index.js';
import { ShellyService } from '../../src/services/shelly/shelly.service.js';

describe('Ingest command', () => {
  const docs: Document[] = [
    {
      pageContent: 'some-text',
      metadata: {},
    },
  ];
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });
  mockConfig.configDir = path.join(process.cwd(), './test/data');

  let mockedShellyService: ShellyService;
  beforeEach(() => {
    mockedShellyService = mock<ShellyService>({
      ingestDirectory: jest.fn().mockResolvedValue(docs),
      ingestGitHubRepo: jest.fn().mockResolvedValue(docs),
    });

    jest
      .spyOn(Ingest.prototype, 'getShelly')
      .mockResolvedValueOnce(mockedShellyService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Directory', () => {
    test.each`
      verbose      | collection           | split        | chunkSize    | chunkOverlap | dryRyn
      ${undefined} | ${undefined}         | ${undefined} | ${undefined} | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${undefined} | ${100}       | ${10}        | ${undefined}
      ${true}      | ${'some-collection'} | ${true}      | ${100}       | ${10}        | ${true}
    `(
      'should call ShellyService.ask with the correct flags ($verbose, $collection, $split, $chunkSize, $chunkOverlap, $dryRun) and args',
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
        expect(Ingest.prototype.getShelly).toHaveBeenCalledTimes(1);
        expect(Ingest.prototype.getShelly).toHaveBeenCalledWith(verbose);
        expect(mockedShellyService.ingestDirectory).toHaveBeenCalledTimes(1);
        expect(mockedShellyService.ingestDirectory).toHaveBeenCalledWith(
          dir,
          collection ?? 'ShellyDefault',
          split,
          chunkSize ?? 400,
          chunkOverlap ?? 50,
          dryRun
        );
        expect(stdoutSpy).toHaveBeenCalledWith(
          expect.stringMatching('Ingested 1 documents')
        );
      }
    );

    it('should throw error when ingest fails', async () => {
      const error = new Error('Some error');
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(process.stderr, 'write').getMockImplementation();

      const mockedShellyService = mock<ShellyService>({
        ingestDirectory: jest.fn().mockRejectedValue(error),
      });

      jest
        .spyOn(Ingest.prototype, 'getShelly')
        .mockResolvedValueOnce(mockedShellyService);

      const dir = '/home/rpidanny/data';
      const args = [`--dir`, dir];

      const ingestCommand = new Ingest(args, mockConfig);

      await ingestCommand.init();

      await expect(ingestCommand.run()).rejects.toThrowError(error);

      expect(mockedShellyService.ingestDirectory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Github', () => {
    const repo = '/home/rpidanny/data';

    test.each`
      verbose      | collection           | split        | chunkSize    | chunkOverlap | dryRyn       | githubBranch
      ${undefined} | ${undefined}         | ${undefined} | ${undefined} | ${undefined} | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${undefined} | ${100}       | ${10}        | ${undefined} | ${undefined}
      ${true}      | ${'some-collection'} | ${true}      | ${100}       | ${10}        | ${true}      | ${'test'}
    `(
      'should call ShellyService.ask with the correct flags ($verbose, $collection, $split, $chunkSize, $chunkOverlap, $dryRun, $githubBranch) and args',
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
        expect(Ingest.prototype.getShelly).toHaveBeenCalledTimes(1);
        expect(Ingest.prototype.getShelly).toHaveBeenCalledWith(verbose);
        expect(mockedShellyService.ingestGitHubRepo).toHaveBeenCalledTimes(1);
        expect(mockedShellyService.ingestGitHubRepo).toHaveBeenCalledWith(
          repo,
          githubBranch ?? 'main',
          collection ?? 'ShellyDefault',
          split,
          chunkSize ?? 400,
          chunkOverlap ?? 50,
          dryRun
        );
        expect(stdoutSpy).toHaveBeenCalledWith(
          expect.stringMatching('Ingested 1 documents')
        );
      }
    );

    it('should throw error when ingest fails', async () => {
      const error = new Error('Some error');
      jest.restoreAllMocks();
      jest.resetAllMocks();
      jest.spyOn(process.stderr, 'write').getMockImplementation();

      const mockedShellyService = mock<ShellyService>({
        ingestGitHubRepo: jest.fn().mockRejectedValue(error),
      });

      jest
        .spyOn(Ingest.prototype, 'getShelly')
        .mockResolvedValueOnce(mockedShellyService);

      const args = [`--githubRepo`, repo];

      const ingestCommand = new Ingest(args, mockConfig);
      await ingestCommand.init();

      await expect(ingestCommand.run()).rejects.toThrowError(error);

      expect(mockedShellyService.ingestGitHubRepo).toHaveBeenCalledTimes(1);
    });
  });
});
