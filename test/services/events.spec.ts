import { mock } from 'jest-mock-extended';

import {
  EventsService,
  IEventsServiceDependencies,
} from '../../src/services/events';
import { ICalTool } from '../../src/utils/tools/ical';

describe('PlannerService', () => {
  const createEventResult = 'event.ics created';
  let service: EventsService;
  let dependencies: IEventsServiceDependencies;

  beforeEach(() => {
    dependencies = {
      tool: mock<ICalTool>({
        call: jest.fn().mockResolvedValue(createEventResult),
      }),
    };
    service = new EventsService(dependencies);
  });

  describe('plan', () => {
    it('should call the tool with the input and return the result', async () => {
      const input = 'input string';
      const result = await service.create(input);
      expect(dependencies.tool.call).toHaveBeenCalledWith(input);
      expect(result).toEqual(createEventResult);
    });
  });
});
