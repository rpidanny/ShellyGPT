import { LLM } from 'langchain/llms/base';

export class FakeLLM extends LLM {
  _llmType(): string {
    return 'fake';
  }

  async _call(prompt: string): Promise<string> {
    return prompt;
  }
}

export function getMockLLM(): LLM {
  return new FakeLLM({});
}
