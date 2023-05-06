import { LLM } from 'langchain/llms';

export class FakeLLM extends LLM {
  _llmType() {
    return 'fake';
  }

  async _call(prompt: string): Promise<string> {
    return prompt;
  }
}

export function getMockLLM(): LLM {
  return new FakeLLM({});
}
