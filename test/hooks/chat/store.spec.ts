import fs from 'fs';
import os from 'os';
import path from 'path';

import storeChatHook from '../../../src/hooks/chat/store';
import { getSampleChat, getSampleChatHistory } from '../../fixtures/chat.hooks';
import { getMockConfig } from '../../fixtures/config';

describe('Hooks - chat:store', () => {
  const mockConfig = getMockConfig();
  const sampleChat = getSampleChat();

  let oclifContext: any;

  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));

    oclifContext = {
      config: { version: '1.2.3', dataDir: tempDir },
      log: jest.fn(),
    };
  });

  afterEach(() => {
    fs.rmdirSync(tempDir, { recursive: true });
  });

  it('should store chat message to local file', async () => {
    const historyFilePath = path.join(
      tempDir,
      'history',
      `${sampleChat.collection}.jsonl`
    );

    await expect(
      storeChatHook.call(oclifContext, {
        id: 'ask',
        argv: [],
        config: mockConfig,
        chat: sampleChat,
      })
    ).resolves.not.toThrow();

    const historyFileContent = fs.readFileSync(historyFilePath, 'utf-8');

    expect(historyFileContent).toEqual(getSampleChatHistory());
  });
});
