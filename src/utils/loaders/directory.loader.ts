import type { readdir as ReaddirT } from 'node:fs/promises';
import type { extname as ExtnameT, resolve as ResolveT } from 'node:path';

import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders/base';

// TypeScript enums are not tree-shakeable, so doing this instead
// See https://bargsten.org/jsts/enums/
export const UnknownHandling = {
  Ignore: 'ignore',
  Warn: 'warn',
  Error: 'error',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UnknownHandling =
  (typeof UnknownHandling)[keyof typeof UnknownHandling];

export interface LoadersMapping {
  [extension: string]: (filePath: string) => BaseDocumentLoader;
}

export class DirectoryLoader extends BaseDocumentLoader {
  constructor(
    public directoryPath: string,
    public loaders: LoadersMapping,
    public recursive: boolean = true,
    public unknown: UnknownHandling = UnknownHandling.Warn,
    public verbose: boolean = false
  ) {
    super();

    if (Object.keys(loaders).length === 0) {
      throw new Error('Must provide at least one loader');
    }
    for (const extension in loaders) {
      if (Object.hasOwn(loaders, extension)) {
        if (extension[0] !== '.') {
          throw new Error(`Extension must start with a dot: ${extension}`);
        }
      }
    }
  }

  public async load(): Promise<Document[]> {
    const { minimatch } = await minimatchImports();
    const { readdir, extname, resolve } = await DirectoryLoader.imports();
    const files = await readdir(this.directoryPath, { withFileTypes: true });

    const documents: Document[] = [];

    for (const file of files) {
      const fullPath = resolve(this.directoryPath, file.name);
      if (file.isDirectory()) {
        if (this.recursive) {
          const loader = new DirectoryLoader(
            fullPath,
            this.loaders,
            this.recursive,
            this.unknown,
            this.verbose
          );
          documents.push(...(await loader.load()));
        }
      } else {
        let matchedLoader = null;
        for (const pattern in this.loaders) {
          if (minimatch(extname(file.name), pattern)) {
            matchedLoader = this.loaders[pattern as `.${string}`];
            break;
          }
        }
        if (matchedLoader) {
          const loader = matchedLoader(fullPath);
          try {
            if (this.verbose) {
              console.log(
                `Loading ${file.name} with ${loader.constructor.name}`
              );
            }
            documents.push(...(await loader.load()));
          } catch (err) {
            console.error(`Error loading ${file.name}: ${err}`);
          }
        } else {
          switch (this.unknown) {
            case UnknownHandling.Ignore:
              break;
            case UnknownHandling.Warn:
              console.warn(`Unknown file type: ${file.name}`);
              break;
            case UnknownHandling.Error:
              throw new Error(`Unknown file type: ${file.name}`);
            default:
              throw new Error(`Unknown unknown handling: ${this.unknown}`);
          }
        }
      }
    }

    return documents;
  }

  static async imports(): Promise<{
    readdir: typeof ReaddirT;
    extname: typeof ExtnameT;
    resolve: typeof ResolveT;
  }> {
    try {
      const { extname, resolve } = await import('node:path');
      const { readdir } = await import('node:fs/promises');
      return { readdir, extname, resolve };
    } catch (e) {
      console.error(e);
      throw new Error(
        `Failed to load fs/promises. DirectoryLoader available only on environment 'node'.`
      );
    }
  }
}

async function minimatchImports() {
  try {
    const minimatch = await import('minimatch');
    return { minimatch: minimatch.default };
  } catch (e) {
    console.error(e);
    throw new Error(
      'Failed to load minimatch. Please install it with eg. `npm install minimatch`.'
    );
  }
}
