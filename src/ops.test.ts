import { afterEach, describe, expect, test, vi } from 'vitest';
import { Axios } from 'axios';
import { createSdkClient } from './client-builder.js';
import { getOpMap } from './ops.js';
import { ServiceSpecification } from './service.js';

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
  const serviceV1 = {
    endpoint: 'settings',
    endpointVersion: 'v1',
    operations: ['get', 'delete', 'list'],
    customOperations: {
      promiseOp: async () => 3,
    },
  } satisfies ServiceSpecification;
  const serviceV2 = {
    endpoint: 'logbook',
    endpointVersion: 'v2',
    operations: ['get', 'delete', 'list', 'listAll'],
    customOperations: {
      promiseOp: async () => 3,
    },
  } satisfies ServiceSpecification;
  const clientBuilder = createSdkClient({
    service: serviceV1,
    serviceV2,
  });
  const client = clientBuilder({ basicAuth: '' });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('operations returning a request config trigger a request call', async () => {
    const basicOp = getOpMap().v1.get;
    const basicOpRes = basicOp(
      {
        client: mockAxiosClient,
        request: {},
        service: serviceV1,
        sdkConfig: { apiKey: '' },
      },
      1,
    );
    expect(basicOpRes).toStrictEqual(
      expect.objectContaining({
        method: 'GET',
      }),
    );

    await client.service.get(1);
    expect(mockAxiosClient.request).toHaveBeenCalledWith(expect.objectContaining(basicOpRes));
  });

  test('operations returning a promise are returned as is', async () => {
    const promiseOpRes = await serviceV1.customOperations.promiseOp();
    expect(promiseOpRes).toStrictEqual(await client.service.promiseOp());
  });

  describe('validation', () => {
    const invalidIds = ['id', { id: 1 }, undefined, null, Infinity, -Infinity, 2.1, NaN];

    test('getOp rejects invalid IDs', () => {
      for (const invalidId of invalidIds) {
        expect(() => client.service.get(invalidId as number)).toThrowError();
        expect(() => client.serviceV2.get(invalidId as number)).toThrowError();
      }
    });

    test('deleteOp rejects invalid IDs', () => {
      for (const invalidId of invalidIds) {
        expect(() => client.service.delete(invalidId as number)).toThrowError();
        expect(() => client.serviceV2.delete(invalidId as number)).toThrowError();
      }
    });
  });

  describe('list', () => {
    describe('v1 ops', () => {
      test('respects `maxResults` parameter in pagination', async () => {
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({ data: [] });

        await client.service.list({}, { maxResults: 2 }).next();
        expect(mockAxiosClient.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.any(String),
            params: {
              limit: 2,
            },
          }),
        );
      });

      test('automatically paginates', async () => {
        const pageTotal = 3;
        let pageCount = 0;
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          headers: {
            'x-limit': 1,
            'x-total-count': pageTotal,
            // eslint-disable-next-line no-plusplus
            'x-offset': pageCount++,
          },
          data: [],
        });

        for await (const res of client.service.list({})) {
          res;
        }
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(pageTotal);
      });

      test('stops automatic pagination after maxResults reached', async () => {
        const pageLimit = 2;
        const pageTotal = 6;
        let pageCount = 0;
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          headers: {
            'x-limit': pageLimit,
            'x-total-count': pageTotal,
            // eslint-disable-next-line no-plusplus
            'x-offset': pageCount++,
          },
          data: new Array(pageLimit).fill('entity'),
        });

        let resultCount = 0;
        for await (const res of client.service.list({}, { maxResults: 3 })) {
          resultCount += 1;
          res;
        }
        expect(resultCount).toBe(3);
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(2);
      });
    });

    describe('v2 ops', () => {
      test('respects `maxResults` parameter in pagination', async () => {
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          data: { data: [], pagination: { next: null, count: 0 } },
        });

        await client.serviceV2.list({ userId: 0 }, { maxResults: 2 }).next();
        expect(mockAxiosClient.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.any(String),
            params: expect.objectContaining({
              limit: 2,
            }),
          }),
        );
      });

      test('automatically paginates', async () => {
        const pageTotal = 3;
        const pageLimit = 2;
        let pageCount = 0;
        vi.spyOn(mockAxiosClient, 'request').mockImplementation(async () => {
          pageCount += 1;
          return {
            data: {
              data: new Array(pageLimit).fill('entity'),
              pagination: {
                next: pageCount < pageTotal ? String(pageCount) : null,
                count: pageTotal,
              },
            },
          };
        });

        for await (const res of client.serviceV2.list({ userId: 0 })) {
          res;
        }
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(pageTotal);
      });

      test('caps each request at the V2 maximum page size', async () => {
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          data: { data: [], pagination: { next: null, count: 0 } },
        });

        await client.serviceV2.listAll({ userId: 0 }, { maxResults: 600 });

        expect(mockAxiosClient.request).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({ limit: 500 }),
          }),
        );
      });

      test('uses the remaining overall limit as the next page size', async () => {
        vi.spyOn(mockAxiosClient, 'request')
          .mockResolvedValueOnce({
            data: {
              data: new Array(500).fill('entity'),
              pagination: { next: 'page-2', count: null },
            },
          })
          .mockResolvedValueOnce({
            data: {
              data: new Array(250).fill('entity'),
              pagination: { next: 'unused', count: null },
            },
          });

        await expect(client.serviceV2.listAll({ userId: 0 }, { maxResults: 750 })).resolves.toHaveLength(750);
        expect(mockAxiosClient.request).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ params: expect.objectContaining({ limit: 500 }) }),
        );
        expect(mockAxiosClient.request).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            params: expect.objectContaining({ cursor: 'page-2', limit: 250 }),
          }),
        );
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(2);
      });

      test('does not request a page when maxResults is zero', async () => {
        const request = vi.spyOn(mockAxiosClient, 'request');

        await expect(client.serviceV2.listAll({ userId: 0 }, { maxResults: 0 })).resolves.toEqual([]);
        expect(request).not.toHaveBeenCalled();
      });

      test('throws when a V2 endpoint repeats a pagination cursor', async () => {
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          data: {
            data: ['entity'],
            pagination: { next: 'repeated-cursor', count: null },
          },
        });

        await expect(client.serviceV2.listAll({ userId: 0 })).rejects.toThrow(
          'V2 pagination returned a repeated cursor',
        );
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(2);
      });

      test('accepts a nullable V2 pagination count', async () => {
        vi.spyOn(mockAxiosClient, 'request').mockResolvedValue({
          data: {
            data: ['entity'],
            pagination: { next: null, count: null },
          },
        });

        await expect(client.serviceV2.listAll({ userId: 0 })).resolves.toEqual(['entity']);
      });

      test('stops automatic pagination after maxResults reached', async () => {
        const pageLimit = 2;
        const pageTotal = 6;
        let pageCount = 0;
        vi.spyOn(mockAxiosClient, 'request').mockImplementation(() => {
          pageCount += pageLimit;
          return Promise.resolve({
            data: {
              data: new Array(pageLimit).fill('entity'),
              pagination: {
                next: pageCount < pageTotal ? String(pageCount) : null,
                count: pageTotal,
              },
            },
          });
        });

        let resultCount = 0;
        for await (const res of client.serviceV2.list({ userId: 0 }, { maxResults: 3 })) {
          resultCount += 1;
          res;
        }
        expect(resultCount).toBe(3);
        expect(mockAxiosClient.request).toHaveBeenCalledTimes(2);
      });
    });
  });
});
