import { Document } from 'langchain/document';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { EPubLoader } from 'langchain/document_loaders/fs/epub';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { TokenTextSplitter } from 'langchain/text_splitter';

export class DataLoaderService {
  private readonly extensionsMap = {
    '.md': (path: string) => new TextLoader(path),
    '.txt': (path: string) => new TextLoader(path),
    '.json': (path: string) => new JSONLoader(path),
    '.ts': (path: string) => new TextLoader(path),
    '.js': (path: string) => new TextLoader(path),
    '.csv': (path: string) => new CSVLoader(path),
    '.docx': (path: string) => new DocxLoader(path),
    '.epub': (path: string) => new EPubLoader(path),
    '.pdf': (path: string) => new PDFLoader(path),
  };

  async loadDirectory(
    path: string,
    split = true,
    chunkSize = 400,
    chunkOverlap = 50
  ): Promise<Document[]> {
    const loader = new DirectoryLoader(path, this.extensionsMap);

    const docs = await loader.load();

    if (!split) return docs;

    const splitter = new TokenTextSplitter({
      encodingName: 'cl100k_base',
      chunkSize,
      chunkOverlap,
    });

    return await splitter.createDocuments(docs.map((d) => d.pageContent));
  }
}
