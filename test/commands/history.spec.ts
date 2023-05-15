import { Config } from '@oclif/core';

import History from '../../src/commands/history';
import { IChatMessage } from '../../src/hooks/chat/interfaces';
import uiOutput from '../../src/utils/ui/output';
import { getMockConfig } from '../fixtures/config.js';

describe('Commands - history:get', () => {
  const mockFlags = { collection: 'foo' };
  let mockConfig: Config;

  beforeEach(() => {
    mockConfig = getMockConfig();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should read history file and print chat messages', async () => {
    jest
      .spyOn(uiOutput, 'printChatMessage')
      .mockImplementation((chat: IChatMessage, log: (msg: string) => void) => {
        log(JSON.stringify(chat));
      });

    // Run the command
    const historyCommand = new History(
      ['--collection', mockFlags.collection],
      mockConfig
    );
    jest.spyOn(historyCommand, 'log').mockImplementation();
    await historyCommand.init();

    await expect(historyCommand.run()).resolves.toBeUndefined();

    expect(historyCommand.log).toHaveBeenCalledTimes(2);
    expect(uiOutput.printChatMessage).toHaveBeenCalledTimes(2);
    expect(uiOutput.printChatMessage).toHaveBeenNthCalledWith(
      1,
      {
        collection: 'foo',
        date: '2020-01-01T00:00:00.000Z',
        message: 'Ping',
        sender: 'AI',
      },
      expect.any(Function)
    );
    expect(uiOutput.printChatMessage).toHaveBeenNthCalledWith(
      2,
      {
        collection: 'foo',
        date: '2020-01-01T00:01:00.000Z',
        message: 'Pong',
        sender: 'User',
      },
      expect.any(Function)
    );
  });
});
