import { Config } from '@oclif/core';
import { mock } from 'jest-mock-extended';

import Serve from '../../src/commands/serve';
import { AskService } from '../../src/services/ask';
import { HistoryService } from '../../src/services/history/history';
import { WebService } from '../../src/services/web/web';
import { getMockConfig } from '../fixtures/config';

describe('Commands - serve', () => {
  let mockConfig: Config;

  beforeEach(() => {
    mockConfig = getMockConfig();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('should call webService.start', async () => {
    const mockedWebService = mock<WebService>();

    jest
      .spyOn(Serve.prototype, 'getWebService')
      .mockReturnValue(mockedWebService);

    const args = [
      ...['--collection', 'some-collection'],
      ...['--port', '4000'],
      '--verbose',
    ];

    const serveCommand = new Serve(args, mockConfig);
    await serveCommand.init();

    await serveCommand.run();

    expect(Serve.prototype.getWebService).toHaveBeenCalledWith(true);
    expect(mockedWebService.start).toHaveBeenCalledTimes(1);
    expect(mockedWebService.start).toHaveBeenCalledWith(
      4000,
      'some-collection'
    );
  });

  describe('get services', () => {
    it('should create and return a new instance of AskService', async () => {
      const args = [...['--collection', 'some-collection']];

      const serveCommand = new Serve(args, mockConfig);
      await serveCommand.init();

      const service = await serveCommand.getAskService(false);

      expect(service).toBeInstanceOf(AskService);
    });

    it('should create and return a new instance of HistoryService', async () => {
      const args = [...['--collection', 'some-collection']];

      const serveCommand = new Serve(args, mockConfig);
      await serveCommand.init();

      const service = await serveCommand.getHistoryService();

      expect(service).toBeInstanceOf(HistoryService);
    });

    it('should create and return a new instance of WebService', async () => {
      const args = [...['--collection', 'some-collection']];

      const serveCommand = new Serve(args, mockConfig);
      await serveCommand.init();

      const service = await serveCommand.getWebService(true);

      expect(service).toBeInstanceOf(WebService);
    });
  });
});
