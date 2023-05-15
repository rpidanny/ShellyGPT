import * as path from 'node:path';
import * as url from 'node:url';

import { SRTLoader } from 'langchain/document_loaders/fs/srt';
import { TextLoader } from 'langchain/document_loaders/fs/text';

import {
  DirectoryLoader,
  UnknownHandling,
} from '../../src/utils/loaders/directory.loader.js';

it('Test Directory loader', async () => {
  const directoryPath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '../data/supported'
  );
  const loader = new DirectoryLoader(
    directoryPath,
    {
      '.srt': (p) => new SRTLoader(p),
      '.txt': (p) => new TextLoader(p),
    },
    true,
    UnknownHandling.Ignore
  );
  const docs = await loader.load();
  expect(docs.length).toBe(2);
  expect(docs.map((d) => d.metadata.source).sort()).toEqual([
    path.resolve(
      directoryPath,
      'srt/the.big.bang.theory.s12e24.720p.bluray.srt'
    ),
    path.resolve(directoryPath, 'txt/dijkstra.txt'),
  ]);
});

it('Test Directory loader with glob', async () => {
  const directoryPath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    '../data/supported'
  );
  const loader = new DirectoryLoader(
    directoryPath,
    {
      '.{txt,md}': (p) => new TextLoader(p),
    },
    true,
    UnknownHandling.Ignore
  );
  const docs = await loader.load();
  expect(docs.length).toBe(2);
  expect(docs.map((d) => d.metadata.source).sort()).toEqual([
    // jsonl
    path.resolve(directoryPath, 'md/openai-evals.md'),
    // TXT
    path.resolve(directoryPath, 'txt/dijkstra.txt'),
  ]);
});
