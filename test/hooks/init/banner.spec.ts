import bannerHook from '../../../src/hooks/init/banner';
import uiOutput from '../../../src/utils/ui/output';
import { getMockConfig } from '../../fixtures/config';

describe('Hooks - init:banner', () => {
  const mockConfig = getMockConfig();

  let oclifContext: any;

  beforeEach(() => {
    oclifContext = {
      config: { version: '1.2.3' },
      log: jest.fn(),
    };
  });

  it('should call uiOutput.printBanner', async () => {
    jest.spyOn(uiOutput, 'printBanner');

    await bannerHook.call(oclifContext, {
      id: 'init',
      argv: [],
      config: mockConfig,
    });

    expect(uiOutput.printBanner).toHaveBeenCalledTimes(1);
    expect(uiOutput.printBanner).toHaveBeenCalledWith(
      '1.2.3',
      oclifContext.log
    );
  });
});
