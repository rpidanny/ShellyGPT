import printChatHook from '../../../src/hooks/chat/print';
import uiOutput from '../../../src/utils/ui/output';
import { getSampleChat } from '../../fixtures/chat.hooks';
import { getMockConfig } from '../../fixtures/config';

describe('Hooks - chat:print', () => {
  const mockConfig = getMockConfig();
  const sampleChat = getSampleChat();

  let oclifContext: any;

  beforeEach(() => {
    oclifContext = {
      config: { version: '1.2.3' },
      log: jest.fn(),
    };
  });

  it('should call uiOutput.printChatMessage', async () => {
    jest.spyOn(uiOutput, 'printChatMessage');

    await printChatHook.call(oclifContext, {
      id: 'ask',
      argv: [],
      config: mockConfig,
      chat: sampleChat,
    });

    expect(uiOutput.printChatMessage).toHaveBeenCalledTimes(1);
    expect(uiOutput.printChatMessage).toHaveBeenCalledWith(
      sampleChat,
      oclifContext.log
    );
  });
});
