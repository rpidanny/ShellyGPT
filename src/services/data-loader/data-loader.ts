import { TiktokenEncoding } from '@dqbd/tiktoken';
import fs from 'fs-extra';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { SRTLoader } from 'langchain/document_loaders/fs/srt';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { TokenTextSplitter } from 'langchain/text_splitter';
import path from 'path';

import { DirectoryLoader } from '../../utils/loaders/directory.loader.js';
import { TikTokenModelMapping } from '../../utils/tiktoken.js';

export class DataLoaderService {
  constructor(
    private readonly llmModelName: string,
    private readonly verbose: boolean = false
  ) {
    if (!(llmModelName in TikTokenModelMapping)) {
      throw new Error(`Model ${llmModelName} is not supported`);
    }
  }

  private readonly extensionsMap: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (path: string) => BaseDocumentLoader
  > = {
    '.md': (path: string) => new TextLoader(path),
    '.txt': (path: string) => new TextLoader(path),
    '.json': (path: string) => new JSONLoader(path),
    '.ts': (path: string) => new TextLoader(path),
    '.js': (path: string) => new TextLoader(path),
    '.csv': (path: string) => new CSVLoader(path),
    '.docx': (path: string) => new DocxLoader(path),
    '.epub': (path: string) => new EPubLoader(path),
    '.pdf': (path: string) => new PDFLoader(path),
    '.srt': (path: string) => new SRTLoader(path),
    '.*': (path: string) => new TextLoader(path),
  };

  async loadDirectory(
    dirPath: string,
    split = false,
    chunkSize = 400,
    chunkOverlap = 50
  ): Promise<Document[]> {
    const loader = new DirectoryLoader(
      dirPath,
      this.extensionsMap,
      true,
      'warn',
      this.verbose
    );

    const docs = await loader.load();

    if (!split) return docs;

    return this.splitDocuments(docs, chunkSize, chunkOverlap);
  }

  async loadFile(
    filePath: string,
    split = false,
    chunkSize = 400,
    chunkOverlap = 50
  ): Promise<Document[]> {
    if (!(await fs.pathExists(filePath))) {
      throw new Error(`File doesn't exist: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    // if extension is not supported, use text loader
    let loader = this.extensionsMap['.txt'];

    if (ext in this.extensionsMap) {
      loader = this.extensionsMap[ext];
    }

    const docs = await loader(filePath).load();

    if (!split) return docs;

    return this.splitDocuments(docs, chunkSize, chunkOverlap);
  }

  async loadGitHubRepo(
    repo: string,
    branch: string,
    split = true,
    chunkSize = 400,
    chunkOverlap = 50
  ): Promise<Document[]> {
    const loader = new GithubRepoLoader(repo, {
      branch,
      recursive: true,
      unknown: 'warn',
    });

    const docs = await loader.load();

    if (!split) return docs;

    return this.splitDocuments(docs, chunkSize, chunkOverlap);
  }

  private async splitDocuments(
    docs: Document[],
    chunkSize: number,
    chunkOverlap: number
  ): Promise<Document[]> {
    const splitter = new TokenTextSplitter({
      encodingName: TikTokenModelMapping[this.llmModelName] as TiktokenEncoding,
      chunkSize,
      chunkOverlap,
    });

    return await splitter.createDocuments(
      docs.map((d) => d.pageContent),
      docs.map((d) => d.metadata)
    );
  }
}
