import { Config } from '@oclif/core';

import Status from '../../src/commands/milvus/status';
import shell from '../../src/utils/shell';
import { getMockConfig } from '../fixtures/config';

describe('Commands - milvus:status', () => {
  let mockConfig: Config;
  let command: Status;

  beforeEach(() => {
    mockConfig = getMockConfig();
    command = new Status([], mockConfig);
    command.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('runs the correct command', async () => {
    jest.spyOn(shell, 'runCommand').mockResolvedValue('some output');
    jest.spyOn(command, 'log').mockImplementation();

    await command.run();

    expect(shell.runCommand).toHaveBeenCalledWith(
      'docker-compose ls --filter name=shelly-milvus'
    );
    expect(command.log).toHaveBeenCalledWith('some output');
  });
});
