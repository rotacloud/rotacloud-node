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
    operations: ['get', 'list'],
    customOperations: {
      promiseOp: async () => 3,
    },
  } satisfies ServiceSpecification;
  const serviceV2 = {
    endpoint: 'logbook',
    endpointVersion: 'v2',
    operations: ['get', 'list'],
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
