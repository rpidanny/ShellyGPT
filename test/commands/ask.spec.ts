import { mock } from 'jest-mock-extended';

import Ask from '../../src/commands/ask/index.js';
import { AskService } from '../../src/services/ask';
import { getMockConfig } from '../fixtures/config.js';

describe('Ask command', () => {
  const mockedAnswer = 'You just use chatGPT';
  const mockConfig = getMockConfig();

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-04-28'));
    jest.spyOn(process.stderr, 'write').mockImplementation();
    jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test.each`
    verbose      | collection           | expectedVerbose | expectedCollection
    ${undefined} | ${'some-collection'} | ${undefined}    | ${'some-collection'}
    ${true}      | ${'some-collection'} | ${true}         | ${'some-collection'}
  `(
    'should call askService.askAboutCollection and emit chat event with the correct params',
    async ({ verbose, collection, expectedVerbose, expectedCollection }) => {
      const mockedAskService = mock<AskService>({
        askAboutCollection: jest.fn().mockResolvedValue(mockedAnswer),
      });

      jest
        .spyOn(Ask.prototype, 'getAskService')
        .mockResolvedValueOnce(mockedAskService);

      const question = 'How do I do something?';
      const args = [
        ...(collection ? ['--collection', collection] : []),
        ...(verbose ? ['--verbose'] : []),
        question,
      ];

      const askCommand = new Ask(args, mockConfig);
      await askCommand.init();

      jest.spyOn(askCommand.config, 'runHook').getMockImplementation();

      const answer = await askCommand.run();

      expect(answer).toEqual(mockedAnswer);
      expect(Ask.prototype.getAskService).toHaveBeenCalledTimes(1);
      expect(Ask.prototype.getAskService).toHaveBeenCalledWith(expectedVerbose);
      expect(mockedAskService.askAboutCollection).toHaveBeenCalledTimes(1);
      expect(mockedAskService.askAboutCollection).toHaveBeenCalledWith(
        question,
        expectedCollection
      );
      expect(askCommand.config.runHook).toHaveBeenCalledTimes(2);
      expect(askCommand.config.runHook).toHaveBeenNthCalledWith(1, 'chat', {
        chat: {
          collection: expectedCollection,
          date: new Date().toUTCString(),
          message: question,
          sender: 'user',
        },
      });
      expect(askCommand.config.runHook).toHaveBeenNthCalledWith(2, 'chat', {
        chat: {
          collection: expectedCollection,
          date: new Date().toUTCString(),
          message: mockedAnswer,
          sender: 'shelly',
        },
      });
    }
  );

  test('should call askService.askQuestion and emit chat event when collection is not provided', async () => {
    const mockedAskService = mock<AskService>({
      askQuestion: jest.fn().mockResolvedValue(mockedAnswer),
    });

    jest
      .spyOn(Ask.prototype, 'getAskService')
      .mockResolvedValueOnce(mockedAskService);

    const question = 'How do I do something?';
    const args = ['--verbose', question];

    const askCommand = new Ask(args, mockConfig);
    await askCommand.init();

    jest.spyOn(askCommand.config, 'runHook').getMockImplementation();

    const answer = await askCommand.run();

    expect(answer).toEqual(mockedAnswer);
    expect(Ask.prototype.getAskService).toHaveBeenCalledTimes(1);
    expect(Ask.prototype.getAskService).toHaveBeenCalledWith(true);
    expect(mockedAskService.askQuestion).toHaveBeenCalledTimes(1);
    expect(mockedAskService.askQuestion).toHaveBeenCalledWith(question);
    expect(askCommand.config.runHook).toHaveBeenCalledTimes(2);
    expect(askCommand.config.runHook).toHaveBeenNthCalledWith(1, 'chat', {
      chat: {
        collection: 'default',
        date: new Date().toUTCString(),
        message: question,
        sender: 'user',
      },
    });
    expect(askCommand.config.runHook).toHaveBeenNthCalledWith(2, 'chat', {
      chat: {
        collection: 'default',
        date: new Date().toUTCString(),
        message: mockedAnswer,
        sender: 'shelly',
      },
    });
  });

  describe('getAskService', () => {
    it('should create and return a new instance of AskService', async () => {
      const question = 'How do I do something?';
      const args = [...['--collection', 'some-collection'], question];

      const askCommand = new Ask(args, mockConfig);
      await askCommand.init();

      const service = await askCommand.getAskService(false);

      expect(service).toBeInstanceOf(AskService);
    });
  });

  // TODO: move to hooks
  it.skip.each(['ts', 'typescript', 'js', 'txt'])(
    'should render %p codeblocks',
    async (lang) => {
      const code = 'console.log("hello")';
      const ansWithCode = `some code with\n\`\`\`${lang}\n${code}\n\`\`\``;

      const mockedAskService = mock<AskService>({
        askAboutCollection: jest.fn().mockResolvedValue(ansWithCode),
      });
      jest
        .spyOn(Ask.prototype, 'getAskService')
        .mockResolvedValueOnce(mockedAskService);
      const stdoutSpy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation();

      const question = 'Give an example of a ts code';
      const args = [question];

      const askCommand = new Ask(args, mockConfig);
      await askCommand.init();

      const answer = await askCommand.run();

      expect(answer).toEqual(ansWithCode);
      expect(Ask.prototype.getAskService).toHaveBeenCalledTimes(1);
      expect(Ask.prototype.getAskService).toHaveBeenCalledWith(undefined);
      expect(mockedAskService.askAboutCollection).toHaveBeenCalledTimes(1);
      expect(mockedAskService.askAboutCollection).toHaveBeenCalledWith(
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
