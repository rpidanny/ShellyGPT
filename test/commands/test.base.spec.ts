import { Config } from '@oclif/core';
import path from 'path';

import localConfig from '../data/config.json';
import { TestCommand } from '../fixtures/test.command.js';

describe('config get', () => {
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });

  beforeAll(() => {
    mockConfig.configDir = path.join(process.cwd(), './test/data');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should parse args correctly', async () => {
    // Arrange
    const command = new TestCommand(['foo', '-v'], mockConfig);

    // Act
    await command.init();
    const args = await command.getArgs();

    // Assert
    expect(args).toMatchObject({ question: 'foo' });
  });

  it('should parse config correctly into this.localConfig', async () => {
    // Arrange
    const command = new TestCommand(['foo'], mockConfig);

    // Act
    await command.init();
    const result = await command.getConfig();

    // Assert
    expect(result).toMatchObject(localConfig);
  });

  describe('flags', () => {
    it('should parse flags correctly when flag is set', async () => {
      // Arrange
      const command = new TestCommand(['foo', '-v'], mockConfig);

      // Act
      await command.init();
      const flags = await command.getFlags();

      // Assert
      expect(flags).toMatchObject({ verbose: true });
    });

    it('should parse flags correctly when flag is not set', async () => {
      // Arrange
      const command = new TestCommand(['foo'], mockConfig);

      // Act
      await command.init();
      const flags = await command.getFlags();

      // Assert
      expect(flags).toMatchObject({});
    });
  });
});
