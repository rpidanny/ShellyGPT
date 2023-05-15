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
  const docsWithMetadata: Document[] = [
    {
      pageContent: getRetrievalContext(),
      metadata: {
        source: 'path/to/source1.js',
        loc: { lines: { from: 1, to: 10 } },
      },
    },
    {
      pageContent: getRetrievalContext(),
      metadata: {
        source: 'path/to/source2.js',
        loc: { lines: { from: 5, to: 15 } },
      },
    },
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
      const addSourcesSpy = jest.spyOn(askService, 'addSources');

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
      expect(addSourcesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSources', () => {
    let askService: AskService;

    beforeEach(() => {
      askService = new AskService(mockDependencies);
    });

    test('should return the original text when sourceDocuments is empty', () => {
      const text = 'Sample text';
      const sourceDocuments: Document[] = [];

      const result = askService.addSources(text, sourceDocuments);

      expect(result).toBe(text);
    });

    test('should append the formatted sources to the text', () => {
      const text = 'Sample text';

      const result = askService.addSources(text, docsWithMetadata);

      expect(result).toContain(text);
      expect(result).toContain('path/to/source1.js');
      expect(result).toContain('path/to/source2.js');
    });
  });

  describe('formatSource', () => {
    let askService: AskService;

    beforeEach(() => {
      askService = new AskService(mockDependencies);
    });

    test('should return an empty string when metadata or source is missing', () => {
      const result = askService.formatSource(docs[0]);

      expect(result).toBe('');
    });

    test('should format the source correctly', () => {
      const result = askService.formatSource(docsWithMetadata[0]);

      expect(result).toBe('- [source1.js (L1-L10)](path/to/source1.js)');
    });
  });
});
