import path from 'path';

import configHook from '../../../src/hooks/init/config';
import uiOutput from '../../../src/utils/ui/output';
import { getMockConfig } from '../../fixtures/config';

describe('Hooks - init:config', () => {
  const mockConfig = getMockConfig();

  let oclifContext: any;

  beforeEach(() => {
    oclifContext = {
      config: {
        version: '1.2.3',
        configDir: path.join(process.cwd(), './test/data/configs'),
      },
      log: jest.fn(),
      exit: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should succeed when valid config is present', async () => {
    jest.spyOn(uiOutput, 'printConfigurationError');

    await expect(
      configHook.call(oclifContext, {
        id: 'init',
        argv: [],
        config: mockConfig,
      })
    ).resolves.not.toThrow();

    expect(uiOutput.printConfigurationError).not.toHaveBeenCalled();
  });

  it("should call this.exit and uiOutput.printConfigurationError when config doesn't exist", async () => {
    jest.spyOn(uiOutput, 'printConfigurationError');

    await expect(
      configHook.call(
        {
          ...oclifContext,
          config: { ...oclifContext.config, configDir: '/some-dir' },
        },
        {
          id: 'init',
          argv: [],
          config: mockConfig,
        }
      )
    ).resolves.not.toThrow();

    expect(uiOutput.printConfigurationError).toHaveBeenCalledTimes(1);
  });

  it('should call this.exit and uiOutput.printConfigurationError when invalid config', async () => {
    jest.spyOn(uiOutput, 'printConfigurationError');

    await expect(
      configHook.call(
        {
          ...oclifContext,
          config: {
            ...oclifContext.config,
            configDir: path.join(process.cwd(), './test/data/configs/invalid'),
          },
        },
        {
          id: 'init',
          argv: [],
          config: mockConfig,
        }
      )
    ).resolves.not.toThrow();

    expect(uiOutput.printConfigurationError).toHaveBeenCalledTimes(1);
  });
});
