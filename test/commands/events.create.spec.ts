import { ux } from '@oclif/core';
import chalk from 'chalk';

import CreateEvents from '../../src/commands/events/create';
import { EventsService } from '../../src/services/events/events';
import { getMockConfig } from '../fixtures/config';

describe('Events - Create', () => {
  const mockConfig = getMockConfig();
  const planResult = 'event.ics created';

  let createEventsCommand: CreateEvents;
  let getEventsService: jest.SpyInstance;

  beforeEach(async () => {
    createEventsCommand = new CreateEvents(
      ['--verbose', 'create  1 week plan for a 5k run starting tomorrow'],
      mockConfig
    );
    await createEventsCommand.init();

    jest.spyOn(process.stderr, 'write').mockImplementation();
    jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should call eventsService with correct input and return the response', async () => {
      getEventsService = jest.spyOn(createEventsCommand, 'getEventsService');
      const eventsService = { create: jest.fn().mockResolvedValue(planResult) };
      getEventsService.mockResolvedValue(eventsService);

      const actionStartSpy = jest.spyOn(ux.action, 'start');
      const actionStopSpy = jest.spyOn(ux.action, 'stop');
      const logSpy = jest
        .spyOn(createEventsCommand, 'log')
        .mockImplementation();

      const result = await createEventsCommand.run();

      expect(getEventsService).toHaveBeenCalledWith('./', true);
      expect(actionStartSpy).toHaveBeenCalledWith('running');
      expect(actionStopSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(`${chalk.green(planResult)}`);
      expect(result).toEqual(planResult);
    });
  });

  describe('getEventsService', () => {
    it('should create and return a new instance of EventsService', async () => {
      const service = await createEventsCommand.getEventsService('./', false);

      expect(service).toBeInstanceOf(EventsService);
    });
  });
});
