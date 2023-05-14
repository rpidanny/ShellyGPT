import got from 'got';
import { mock } from 'jest-mock-extended';

import { IChatMessage } from '../../src/hooks/chat/interfaces';
import { AskService } from '../../src/services/ask';
import { HistoryService } from '../../src/services/history/history';
import {
  ILogger,
  IWebServiceDependencies,
} from '../../src/services/web/interfaces';
import { WebService } from '../../src/services/web/web';

const rootDir = process.cwd();
// Mocked dependencies for the WebService
const dependencies: IWebServiceDependencies = {
  askService: mock<AskService>(),
  historyService: mock<HistoryService>(),
};
const logger: ILogger = mock<ILogger>();

// The port and collection to use during the tests
const port = 8080;
const collection = 'test';

// The URL of the server, constructed from the port and collection
const url = `http://localhost:${port}/api`;

const msg: IChatMessage = {
  collection: 'test',
  message: 'hello world',
  sender: 'user',
  date: new Date().toISOString(),
};

describe('WebService', () => {
  let webService: WebService;

  beforeAll(async () => {
    webService = new WebService(rootDir, dependencies, logger);
    await webService.start(port, collection);
  });

  afterAll(() => {
    webService.close();
  });

  describe('POST /api/chat', () => {
    it('should store the message and return the answer', async () => {
      const message = 'Hello, world!';

      // Mock the dependencies
      jest
        .spyOn(dependencies.historyService, 'storeMessage')
        .mockResolvedValueOnce();
      jest
        .spyOn(dependencies.askService, 'askAboutCollection')
        .mockResolvedValueOnce('Hi there!');

      // Send the POST request to the server
      const response = await got.post(`${url}/chat`, {
        json: { message },
        responseType: 'json',
      });

      // Assert that the response is correct
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        text: 'Hi there!',
        sender: 'shelly',
        date: expect.any(String),
      });

      // Assert that the message was stored with the correct arguments
      expect(dependencies.historyService.storeMessage).toHaveBeenCalledWith({
        message,
        sender: 'user',
        collection,
        date: expect.any(String),
      });
      expect(dependencies.historyService.storeMessage).toHaveBeenCalledWith({
        message: 'Hi there!',
        sender: 'shelly',
        collection,
        date: expect.any(String),
      });

      // Assert that the askService was called with the correct arguments
      expect(dependencies.askService.askAboutCollection).toHaveBeenCalledWith(
        message,
        collection
      );
    });
  });

  describe('GET /api/init', () => {
    it('should return the history and collection', async () => {
      const history = [msg, msg];

      // Mock the dependencies
      jest
        .spyOn(dependencies.historyService, 'getHistory')
        .mockResolvedValueOnce(history);

      // Send the GET request to the server
      const response = await got.get(`${url}/init`, { responseType: 'json' });

      // Assert that the response is correct
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ history, collection });

      // Assert that the historyService was called with the correct arguments
      expect(dependencies.historyService.getHistory).toHaveBeenCalledWith(
        collection
      );
    });
  });
});
