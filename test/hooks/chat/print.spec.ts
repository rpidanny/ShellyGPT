import printChatHook from '../../../src/hooks/chat/print';
import ui from '../../../src/utils/ui';
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

  it('should call ui.printChatMessage', async () => {
    jest.spyOn(ui, 'printChatMessage');

    await printChatHook.call(oclifContext, {
      id: 'ask',
      argv: [],
      config: mockConfig,
      chat: sampleChat,
    });

    expect(ui.printChatMessage).toHaveBeenCalledTimes(1);
    expect(ui.printChatMessage).toHaveBeenCalledWith(
      sampleChat,
      oclifContext.log
    );
  });
});
