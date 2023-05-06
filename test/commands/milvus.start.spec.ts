import { Config } from '@oclif/core';
import chalk from 'chalk';

import Start from '../../src/commands/milvus/start';
import shell from '../../src/utils/shell';
import { getMockConfig } from '../fixtures/config';

describe('Commands - milvus:start', () => {
  let mockConfig: Config;
  let command: Start;

  beforeEach(() => {
    mockConfig = getMockConfig();
    mockConfig.root = process.cwd();
    command = new Start([], mockConfig);
    command.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('runs docker-compose command with correct parameters and logs success message', async () => {
    // Arrange
    const logSpy = jest.spyOn(command, 'log').mockImplementation();
    jest
      .spyOn(shell, 'runCommandWithStream')
      .mockImplementationOnce(async (_, onStdout, onStderr) => {
        onStdout('Starting Milvus...\n');
        onStdout('Milvus started successfully!\n');
        onStderr('');
      });

    // Act
    await command.run();

    // Assert
    expect(shell.runCommandWithStream).toHaveBeenCalledTimes(1);
    expect(shell.runCommandWithStream).toHaveBeenCalledWith(
      `docker-compose -f ${process.cwd()}/docker/milvus/docker-compose.yml -p shelly-milvus up -d`,
      expect.any(Function),
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith(
      `${chalk.green.bold(`Milvus Started🚀:`)} ${chalk.cyanBright.underline(
        `http://localhost:8848`
      )}`
    );
    expect(logSpy).toHaveBeenCalledWith('');
    expect(logSpy).toHaveBeenCalledWith(chalk.magenta('Good Luck!'));
  });

  test('logs error message if docker-compose command fails', async () => {
    // Arrange
    const logSpy = jest.spyOn(command, 'log').mockImplementation();
    jest
      .spyOn(shell, 'runCommandWithStream')
      .mockImplementationOnce(async (_, onStdout, onStderr) => {
        onStdout('');
        onStderr('Error starting Milvus!\n');
      });

    // Act
    await command.run();

    // Assert
    expect(shell.runCommandWithStream).toHaveBeenCalledTimes(1);
    expect(shell.runCommandWithStream).toHaveBeenCalledWith(
      `docker-compose -f ${process.cwd()}/docker/milvus/docker-compose.yml -p shelly-milvus up -d`,
      expect.any(Function),
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith('Error starting Milvus!\n');
  });
});
