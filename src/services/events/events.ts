import { IEventsServiceDependencies } from './interfaces.js';

export class EventsService {
  constructor(private readonly dependencies: IEventsServiceDependencies) {}

  async create(input: string): Promise<string> {
    return this.dependencies.tool.call(input);
  }
}
