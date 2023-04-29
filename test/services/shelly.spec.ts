import { mock } from 'jest-mock-extended';
import { Document } from 'langchain/document';

import { DataLoaderService } from '../../src/services/data-loader/data-loader.service';
import { ShellyService } from '../../src/services/shelly/shelly.service';
import { VectorStoreService } from '../../src/services/vector-store/vector-store.service';
import { getMockConfig } from '../fixtures/config';

describe('Shelly Service', () => {
  let dataLoaderService: DataLoaderService;
  let vectorStoreService: VectorStoreService;
  let shelly: ShellyService;
  const docs: Document[] = [{ pageContent: 'some text', metadata: {} }];

  const mockConfig = getMockConfig();

  beforeEach(() => {
    dataLoaderService = mock<DataLoaderService>();
    vectorStoreService = mock<VectorStoreService>();

    shelly = new ShellyService(
      { dataLoaderService, vectorStoreService },
      mockConfig
    );
  });

  describe('ingestDocument', () => {
    it('should not call vectorStoreService when dryRun is true', async () => {
      dataLoaderService.loadDirectory = jest.fn().mockResolvedValue(docs);

      const resp = await shelly.ingestDirectory(
        './data',
        'some-collection',
        undefined,
        undefined,
        undefined,
        true
      );

      expect(resp).toEqual(docs);
      expect(dataLoaderService.loadDirectory).toHaveBeenCalledTimes(1);
      expect(vectorStoreService.storeDocuments).not.toBeCalled();
    });

    it('should call vectorStoreService when dryRun is false', async () => {
      dataLoaderService.loadDirectory = jest.fn().mockResolvedValue(docs);

      const resp = await shelly.ingestDirectory(
        './data',
        'some-collection',
        undefined,
        undefined,
        undefined,
        false
      );

      expect(resp).toEqual(docs);
      expect(dataLoaderService.loadDirectory).toHaveBeenCalledTimes(1);
      expect(vectorStoreService.storeDocuments).toBeCalled();
    });

    it('should call vectorStoreService by default', async () => {
      dataLoaderService.loadDirectory = jest.fn().mockResolvedValue(docs);

      const resp = await shelly.ingestDirectory('./data', 'some-collection');

      expect(resp).toEqual(docs);
      expect(dataLoaderService.loadDirectory).toHaveBeenCalledTimes(1);
      expect(vectorStoreService.storeDocuments).toBeCalled();
    });
  });
});
