import prettyErrorHook from '../../../src/hooks/command_not_found/pretty-error';
import uiOutput from '../../../src/utils/ui/output';
import { getMockConfig } from '../../fixtures/config';

describe('Hooks - command_not_found:pretty-error', () => {
  const mockConfig = getMockConfig();

  let oclifContext: any;

  beforeEach(() => {
    oclifContext = {
      config: { version: '1.2.3' },
      log: jest.fn(),
      exit: jest.fn(),
    };
  });

  it('should call uiOutput.printInvalidCommandMessage', async () => {
    jest.spyOn(uiOutput, 'printInvalidCommandMessage');

    await prettyErrorHook.call(oclifContext, {
      id: 'invalid-command',
      argv: [],
      config: mockConfig,
    });

    expect(oclifContext.exit).toHaveBeenCalledTimes(1);
    expect(oclifContext.exit).toHaveBeenCalledWith(1);
    expect(uiOutput.printInvalidCommandMessage).toHaveBeenCalledTimes(1);
    expect(uiOutput.printInvalidCommandMessage).toHaveBeenCalledWith(
      'invalid-command',
      oclifContext.log
    );
  });
});
