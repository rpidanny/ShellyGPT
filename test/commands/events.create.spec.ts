import { Config, ux } from '@oclif/core';
import chalk from 'chalk';
import path from 'path';

import Planner from '../../src/commands/events/create';
import { EventsService } from '../../src/services/events/events';

describe('Events - Create', () => {
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });
  mockConfig.configDir = path.join(process.cwd(), './test/data');
  const planResult = 'event.ics created';

  let planner: Planner;
  let getEventsService: jest.SpyInstance;

  beforeEach(async () => {
    planner = new Planner(
      ['--verbose', 'create  1 week plan for a 5k run starting tomorrow'],
      mockConfig
    );
    await planner.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('run', () => {
    it('should call eventsService with correct input and return the response', async () => {
      getEventsService = jest.spyOn(planner, 'getEventsService');
      const eventsService = { create: jest.fn().mockResolvedValue(planResult) };
      getEventsService.mockResolvedValue(eventsService);

      const actionStartSpy = jest.spyOn(ux.action, 'start');
      const actionStopSpy = jest.spyOn(ux.action, 'stop');
      const logSpy = jest.spyOn(planner, 'log').mockImplementation();

      const result = await planner.run();

      expect(getEventsService).toHaveBeenCalledWith(true);
      expect(actionStartSpy).toHaveBeenCalledWith('running');
      expect(actionStopSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(`${chalk.green(planResult)}`);
      expect(result).toEqual(planResult);
    });
  });

  describe('getEventsService', () => {
    it('should create and return a new instance of PlannerService', async () => {
      const service = await planner.getEventsService(false);

      expect(service).toBeInstanceOf(EventsService);
    });
  });
});
