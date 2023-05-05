import { BaseLLM, LLM } from 'langchain/llms/base';
import { BaseFileStore } from 'langchain/schema';

import { ICalTool } from '../../../src/utils/tools/ical';
import {
  getIcsString,
  getInputCommand,
  getInputPrompt,
  getOutputPrompt,
} from '../../fixtures/ical.tool';

class FakeLLM extends LLM {
  _llmType() {
    return 'fake';
  }

  async _call(prompt: string): Promise<string> {
    return prompt;
  }
}

describe('ICalTool', () => {
  let tool: ICalTool;
  let store: BaseFileStore;
  let llm: BaseLLM;

  const uuidRegex =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/g;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2019-10-21'));
  });

  beforeEach(() => {
    store = {
      writeFile: jest.fn(),
      readFile: jest.fn(),
    };
    llm = new FakeLLM({});
    tool = new ICalTool({ store, llm });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('_call', () => {
    it('should create iCal file and return success message', async () => {
      const inputStr = getInputCommand();

      const expectedFilename = 'events.ics';

      const llmSpy = jest
        .spyOn(llm, 'call')
        .mockResolvedValueOnce(getOutputPrompt());
      const writeFileSpy = jest
        .spyOn(store, 'writeFile')
        .mockResolvedValueOnce();

      const result = await tool._call(inputStr);

      expect(result).toEqual(`${expectedFilename} created successfully`);
      expect(store.writeFile).toHaveBeenCalledWith(
        expectedFilename,
        expect.any(String)
      );
      expect(llmSpy.mock.calls[0][0]).toEqual(getInputPrompt(inputStr));
      expect(writeFileSpy.mock.calls[0][0]).toEqual('events.ics');
      expect(
        writeFileSpy.mock.calls[0][1]
          .replace(uuidRegex, 'UUID_PLACEHOLDER')
          .replace(/\r\n/g, '\n')
      ).toEqual(getIcsString());
    });
  });
});
