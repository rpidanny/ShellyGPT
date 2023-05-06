import { mock } from 'jest-mock-extended';
// import { FakeEmbeddings } from 'langchain/embeddings';
import { Document } from 'langchain/document';
import { Embeddings } from 'langchain/embeddings';
import { LLM } from 'langchain/llms/base';
import { VectorStoreRetriever } from 'langchain/vectorstores/base';

import { AskService, IAskServiceDependencies } from '../../src/services/ask';
import { VectorStoreService } from '../../src/services/vector-store/vector-store.service';
import {
  getLLMGenerations,
  getLLMResponse,
  getRetrievalContext,
  getRetrievalLLMGeneratePromptInput,
} from '../fixtures/ask.command';

describe('AskService', () => {
  const docs: Document[] = [
    { pageContent: getRetrievalContext(), metadata: {} },
  ];
  const mockRetriever = mock<VectorStoreRetriever>({
    getRelevantDocuments: jest.fn().mockResolvedValue(docs),
  });

  const mockDependencies: IAskServiceDependencies = {
    vectorStoreService: mock<VectorStoreService>({
      getVectorStore: jest.fn().mockResolvedValue({
        asRetriever() {
          return mockRetriever;
        },
      }),
    }),
    embeddings: mock<Embeddings>(),
    llm: mock<LLM>({
      generatePrompt: jest.fn().mockResolvedValue(getLLMGenerations()),
    }),
  };

  describe('askAboutCollection', () => {
    test('should return a string answer', async () => {
      // Arrange
      const askService = new AskService(mockDependencies);
      const question = 'What is the meaning of life?';
      const collection = 'dummyCollection';
      const llmCallSpy = jest
        .spyOn(mockDependencies.llm, 'generatePrompt')
        .mockResolvedValue(getLLMGenerations());

      // Act
      const answer = await askService.askAboutCollection(question, collection);

      // Assert
      expect(typeof answer).toBe('string');
      expect(answer).toEqual(getLLMResponse());
      expect(llmCallSpy).toHaveBeenCalledWith(
        getRetrievalLLMGeneratePromptInput(),
        undefined,
        undefined
      );
      expect(mockRetriever.getRelevantDocuments).toHaveBeenCalledTimes(1);
    });
  });
});
