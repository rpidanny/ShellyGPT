import { Config } from '@oclif/core';
import { mock } from 'jest-mock-extended';
import path from 'path';

import Ask from '../../src/commands/ask/index.js';
import { ShellyService } from '../../src/services/shelly/shelly.service.js';

describe('Ask command', () => {
  const mockedAnswer = 'You just use chatGPT';
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });
  mockConfig.configDir = path.join(process.cwd(), './test/data');

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test.each`
    verbose      | collection           | expectedVerbose | expectedCollection
    ${undefined} | ${'some-collection'} | ${undefined}    | ${'some-collection'}
    ${undefined} | ${undefined}         | ${undefined}    | ${'ShellyDefault'}
    ${true}      | ${'some-collection'} | ${true}         | ${'some-collection'}
  `(
    'should call ShellyService.ask with the correct question and collection',
    async ({ verbose, collection, expectedVerbose, expectedCollection }) => {
      const stdoutSpy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation();

      const mockedShellyService = mock<ShellyService>({
        ask: jest.fn().mockResolvedValue(mockedAnswer),
      });

      jest
        .spyOn(Ask.prototype, 'getShelly')
        .mockResolvedValueOnce(mockedShellyService);

      const question = 'How do I do something?';
      const args = [
        ...(collection ? ['--collection', collection] : []),
        ...(verbose ? ['--verbose'] : []),
        question,
      ];

      const askCommand = new Ask(args, mockConfig);
      await askCommand.init();

      const answer = await askCommand.run();

      expect(answer).toEqual(mockedAnswer);
      expect(Ask.prototype.getShelly).toHaveBeenCalledTimes(1);
      expect(Ask.prototype.getShelly).toHaveBeenCalledWith(expectedVerbose);
      expect(mockedShellyService.ask).toHaveBeenCalledTimes(1);
      expect(mockedShellyService.ask).toHaveBeenCalledWith(
        question,
        expectedCollection
      );
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(question));
      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringMatching(mockedAnswer)
      );
    }
  );

  it.each(['ts', 'typescript', 'js', 'txt'])(
    'should render %p codeblocks',
    async (lang) => {
      const code = 'console.log("hello")';
      const ansWithCode = `some code with\n\`\`\`${lang}\n${code}\n\`\`\``;

      const mockedShellyService = mock<ShellyService>({
        ask: jest.fn().mockResolvedValue(ansWithCode),
      });
      jest
        .spyOn(Ask.prototype, 'getShelly')
        .mockResolvedValueOnce(mockedShellyService);
      const stdoutSpy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation();

      const question = 'Give an example of a ts code';
      const args = [question];

      const askCommand = new Ask(args, mockConfig);
      await askCommand.init();

      const answer = await askCommand.run();

      expect(answer).toEqual(ansWithCode);
      expect(Ask.prototype.getShelly).toHaveBeenCalledTimes(1);
      expect(Ask.prototype.getShelly).toHaveBeenCalledWith(undefined);
      expect(mockedShellyService.ask).toHaveBeenCalledTimes(1);
      expect(mockedShellyService.ask).toHaveBeenCalledWith(
        question,
        'ShellyDefault'
      );
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching(question));
      expect(stdoutSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(ansWithCode)
      );
    }
  );
});
