import { describe, expect, test, vi } from 'vitest';
import { Axios } from 'axios';
import { createSdkClient } from './client-builder.js';

let mockAxiosClient: Axios;
vi.mock(import('axios'), async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    default: {
      ...mod.default,
      create: (...args) => {
        mockAxiosClient = mod.default.create(...args);
        mockAxiosClient.request = vi.fn().mockImplementation(() => Promise.resolve({}));
        return mockAxiosClient;
      },
    },
    // NOTE: vitest does not correctly infer the type for default hence the cast
  } as any;
});

describe('Operations', () => {
  describe('list op', () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'settings',
        endpointVersion: 'v1',
        operations: ['list'],
      },
    });
    const client = clientBuilder({ basicAuth: '' });

    test('respects `maxResults` parameter in legacy pagination', async () => {
      vi.spyOn(mockAxiosClient, 'get').mockImplementation(() => Promise.resolve({ data: [] }));

      await client.service.list({}, { maxResults: 2 }).next();
      expect(mockAxiosClient.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: {
            limit: 2,
          },
        }),
      );
    });

    test('automatically paginates', async () => {
      const pageTotal = 3;
      let pageCount = 0;
      vi.spyOn(mockAxiosClient, 'get').mockImplementation(() =>
        Promise.resolve({
          headers: {
            'x-limit': 1,
            'x-total-count': pageTotal,
            // eslint-disable-next-line no-plusplus
            'x-offset': pageCount++,
          },
          data: [],
        }),
      );

      for await (const res of client.service.list({})) {
        res;
      }
      expect(mockAxiosClient.get).toHaveBeenCalledTimes(pageTotal);
    });

    test('stops automatic pagination after maxResults reached', async () => {
      const pageLimit = 2;
      const pageTotal = 6;
      let pageCount = 0;
      vi.spyOn(mockAxiosClient, 'get').mockImplementation(() =>
        Promise.resolve({
          headers: {
            'x-limit': pageLimit,
            'x-total-count': pageTotal,
            // eslint-disable-next-line no-plusplus
            'x-offset': pageCount++,
          },
          data: new Array(pageLimit).fill('entity'),
        }),
      );

      let resultCount = 0;
      for await (const res of client.service.list({}, { maxResults: 3 })) {
        resultCount += 1;
        res;
      }
      expect(resultCount).toBe(3);
      expect(mockAxiosClient.get).toHaveBeenCalledTimes(2);
    });
  });
});
