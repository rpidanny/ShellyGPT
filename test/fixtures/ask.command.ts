import { LLMResult } from 'langchain/schema';

export function getLLMResponse(): string {
  return `This is a dummy answer`;
}

export function getRetrievalContext(): string {
  return `Some context`;
}

export function getRetrievalLLMGeneratePromptInput(): Record<string, string>[] {
  return [
    {
      value: `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

${getRetrievalContext()}

Question: What is the meaning of life?
Helpful Answer:`,
    },
  ];
}

export function getLLMGenerations(): LLMResult {
  return {
    generations: [
      [
        {
          text: getLLMResponse(),
        },
      ],
    ],
  };
}
