import bannerHook from '../../../src/hooks/init/banner';
import ui from '../../../src/utils/ui';
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

  it('should call ui.printBanner', async () => {
    jest.spyOn(ui, 'printBanner');

    await bannerHook.call(oclifContext, {
      id: 'init',
      argv: [],
      config: mockConfig,
    });

    expect(ui.printBanner).toHaveBeenCalledTimes(1);
    expect(ui.printBanner).toHaveBeenCalledWith('1.2.3', oclifContext.log);
  });
});
