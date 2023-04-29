import { Config } from '@oclif/core';
import path from 'path';

import Get from '../../src/commands/config/get.js';
import localConfig from '../data/config.json';

describe('config get', () => {
  const mockConfig = new Config({ root: process.cwd(), ignoreManifest: true });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should print and return the local config', async () => {
    // Arrange
    const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
    mockConfig.configDir = path.join(process.cwd(), './test/data');
    const getCommand = new Get([], mockConfig);

    // Act
    await getCommand.init();

    const result = await getCommand.run();

    // Assert
    expect(result).toMatchObject(localConfig);
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching('openAi'));
    expect(stdoutSpy).toHaveBeenCalledWith(
      expect.stringMatching('vectorStore')
    );
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching('milvus'));
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringMatching('pinecone'));
  });
});
