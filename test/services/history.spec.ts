import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import { IChatMessage } from '../../src/hooks/chat/interfaces';
import { HistoryService } from '../../src/services/history/history';

describe('HistoryService', () => {
  let tempDir: string;
  let historyService: HistoryService;

  const msg: IChatMessage = {
    collection: 'test',
    message: 'hello world',
    sender: 'user',
    date: new Date().toISOString(),
  };

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));

    historyService = new HistoryService(tempDir);
  });

  afterEach(async () => {
    fs.rmdirSync(tempDir, { recursive: true });
  });

  describe('storeMessage', () => {
    it('should store the message in the correct file', async () => {
      await historyService.storeMessage(msg);

      const historyFilePath = path.join(tempDir, 'history', 'test.jsonl');
      const fileContents = await fs.readFile(historyFilePath, 'utf-8');

      expect(JSON.parse(fileContents)).toEqual(msg);
    });
  });

  describe('getHistory', () => {
    it('should return the messages from the correct file', async () => {
      // Write some messages to the history file
      const historyFilePath = path.join(tempDir, 'history', 'test.jsonl');
      await fs.ensureFile(historyFilePath);
      await fs.appendFile(historyFilePath, `${JSON.stringify(msg)}\n`);
      await fs.appendFile(
        historyFilePath,
        `${JSON.stringify({ ...msg, message: 'how are you?' })}\n`
      );

      const result = await historyService.getHistory('test');

      expect(result).toEqual([msg, { ...msg, message: 'how are you?' }]);
    });

    it('should ignore empty lines in the file', async () => {
      // Write some messages to the history file, with an empty line in the middle
      const historyFilePath = path.join(tempDir, 'history', 'test.jsonl');
      await fs.ensureFile(historyFilePath);
      await fs.appendFile(historyFilePath, `${JSON.stringify(msg)}\n`);
      await fs.appendFile(historyFilePath, '\n');
      await fs.appendFile(historyFilePath, `${JSON.stringify(msg)}\n`);

      const result = await historyService.getHistory('test');

      expect(result).toEqual([msg, msg]);
    });
  });
});
