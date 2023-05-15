import { ZeroShotCoTAPEPrompt } from '@rpidanny/llm-prompt-templates';
import { RetrievalQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import { PromptTemplate } from 'langchain/prompts';
import path from 'path';

import { IAskServiceDependencies } from './interfaces.js';

export class AskService {
  questionTemplate: PromptTemplate;

  constructor(private readonly dependencies: IAskServiceDependencies) {
    this.questionTemplate = new PromptTemplate({
      template: ZeroShotCoTAPEPrompt.content,
      inputVariables: ['question'],
    });
  }

  async askQuestion(question: string): Promise<string> {
    return this.dependencies.llm.call(
      await this.questionTemplate.format({ question })
    );
  }

  async askAboutCollection(
    question: string,
    collection: string
  ): Promise<string> {
    const vectorStore =
      await this.dependencies.vectorStoreService.getVectorStore(
        this.dependencies.embeddings,
        collection
      );

    const chain = RetrievalQAChain.fromLLM(
      this.dependencies.llm,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
      }
    );

    const resp = await chain.call({
      query: question,
    });

    const { text, sourceDocuments } = resp;
    return this.addSources(text, sourceDocuments);
  }

  addSources(text: string, sourceDocuments: Document[]): string {
    const sources = sourceDocuments.reduce<string[]>((acc, doc) => {
      const source = this.formatSource(doc);
      if (source !== '') acc.push(source);
      return acc;
    }, []);

    if (!sources.length) return text;

    return `${text}\n\n## Sources\n${sources.join('\n')}`;
  }

  formatSource(doc: Document): string {
    const { metadata } = doc;
    if (!metadata || !metadata.source) return '';

    const fileName = path.basename(doc.metadata.source);

    return `- [${fileName} (L${metadata.loc.lines.from}-L${metadata.loc.lines.to})](${metadata.source})`;
  }
}
