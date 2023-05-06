import { Config } from '@oclif/core';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import Configure from '../../src/commands/configure';
import { VectorStores } from '../../src/config/enums';
import { TConfig } from '../../src/config/schema';
import uiInput from '../../src/utils/ui/input';
import { getMockConfig, getMockLocalConfig } from '../fixtures/config';

describe('Configure command', () => {
  const mockLocalConfig = getMockLocalConfig();

  let mockConfig: Config;
  let command: Configure;

  beforeEach(async () => {
    mockConfig = getMockConfig();
    command = new Configure([], mockConfig);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('user prompts', () => {
    it('should prompt user for OpenAI, VectorStore and Milvus configurations when Milvus vector store selected', async () => {
      // mock user inputs
      jest
        .spyOn(uiInput, 'promptOpenAiConfig')
        .mockResolvedValueOnce(mockLocalConfig.openAi);
      jest
        .spyOn(uiInput, 'promptVectorStoreConfig')
        .mockResolvedValueOnce(VectorStores.Milvus);
      jest
        .spyOn(uiInput, 'promptMilvusConfig')
        .mockResolvedValueOnce(mockLocalConfig.milvus);
      jest.spyOn(uiInput, 'promptPineconeConfig').mockImplementation();
      jest.spyOn(command, 'saveConfig').mockImplementation();
      jest.spyOn(command, 'getExistingConfig').mockResolvedValueOnce(null);

      // execute command
      await command.run();

      // verify user inputs
      expect(command.getExistingConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptOpenAiConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptVectorStoreConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptMilvusConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptPineconeConfig).not.toHaveBeenCalled();
      expect(command.saveConfig).toHaveBeenCalledTimes(1);
      expect(command.saveConfig).toHaveBeenCalledWith(
        `${mockConfig.configDir}/config.json`,
        {
          openAi: mockLocalConfig.openAi,
          vectorStore: mockLocalConfig.vectorStore,
          milvus: mockLocalConfig.milvus,
        }
      );
    });

    it('should prompt user for OpenAI, VectorStore and Milvus configurations when Pinecone vector store selected', async () => {
      // mock user inputs
      jest
        .spyOn(uiInput, 'promptOpenAiConfig')
        .mockResolvedValueOnce(mockLocalConfig.openAi);
      jest
        .spyOn(uiInput, 'promptVectorStoreConfig')
        .mockResolvedValueOnce(VectorStores.PineCone);
      jest
        .spyOn(uiInput, 'promptPineconeConfig')
        .mockResolvedValueOnce(mockLocalConfig.pinecone);
      jest.spyOn(uiInput, 'promptMilvusConfig').mockImplementation();
      jest.spyOn(command, 'saveConfig').mockImplementation();
      jest.spyOn(command, 'getExistingConfig').mockResolvedValueOnce(null);

      // execute command
      await command.run();

      // verify user inputs
      expect(command.getExistingConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptOpenAiConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptVectorStoreConfig).toHaveBeenCalledTimes(1);
      expect(uiInput.promptMilvusConfig).not.toHaveBeenCalled();
      expect(uiInput.promptPineconeConfig).toHaveBeenCalledTimes(1);
      expect(command.saveConfig).toHaveBeenCalledTimes(1);
      expect(command.saveConfig).toHaveBeenCalledWith(
        `${mockConfig.configDir}/config.json`,
        {
          openAi: mockLocalConfig.openAi,
          vectorStore: VectorStores.PineCone,
          pinecone: mockLocalConfig.pinecone,
        }
      );
    });
  });

  describe('existing config', () => {
    it('should fetch existing config if it exists', async () => {
      await expect(
        command.getExistingConfig(`${mockConfig.configDir}/config.json`)
      ).resolves.toMatchObject(getMockLocalConfig());
    });

    it("should return null if config doesn't exist", async () => {
      await expect(
        command.getExistingConfig(`/foo/bar/config.json`)
      ).resolves.toBeNull();
    });
  });

  describe('save config', () => {
    let tempDir: string;
    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
    });

    afterEach(() => {
      fs.removeSync(tempDir);
    });

    it('should save config to file', async () => {
      const configFilePath = `${tempDir}/config.json`;
      await expect(
        command.saveConfig(configFilePath, getMockLocalConfig())
      ).resolves.toBeUndefined();
      await expect(fs.readFileSync(configFilePath, 'utf8')).toEqual(
        JSON.stringify(getMockLocalConfig() as TConfig, null, 2)
      );
    });
  });
});
