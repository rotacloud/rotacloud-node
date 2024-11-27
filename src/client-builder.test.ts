import { test, expect, describe, vi } from 'vitest';
import { Axios } from 'axios';
import { createSdkClient, DEFAULT_CONFIG } from './client-builder.js';
import { SDKConfig } from './main.js';
import { version } from '../package.json' assert { type: 'json' };

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

const sdkConfig: SDKConfig = {
  basicAuth: '',
};

describe('SDK client builder', () => {
  test('basic services are created', () => {
    const clientBuilder = createSdkClient({
      basicService1: {
        endpoint: 'accounts',
        endpointVersion: 'v1',
        operations: [],
      },
      basicService2: {
        endpoint: 'attendance',
        endpointVersion: 'v1',
        operations: [],
      },
    });
    const client = clientBuilder(sdkConfig);

    expect(client).toMatchObject({ basicService1: {}, basicService2: {} });
  });

  test('operations are created for services', () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'accounts',
        endpointVersion: 'v1',
        operations: ['get', 'listAll', 'create'],
      },
    });
    const client = clientBuilder(sdkConfig);

    expect(client.service).toStrictEqual({
      get: expect.any(Function),
      listAll: expect.any(Function),
      create: expect.any(Function),
    });
  });

  test('custom operations are created for services', () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'accounts',
        endpointVersion: 'v1',
        operations: ['get'],
        customOperations: {
          customOp: () => {},
        },
      },
    });
    const client = clientBuilder(sdkConfig);

    expect(client.service).toStrictEqual({
      get: expect.any(Function),
      customOp: expect.any(Function),
    });
  });

  test("service URL's have their versions specified in the URL", async () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'accounts',
        endpointVersion: 'v1',
        operations: ['get'],
      },
    });
    const client = clientBuilder(sdkConfig);

    await client.service.get(1);
    expect(mockAxiosClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'v1/accounts/1',
      }),
    );
  });

  test('SDK version is included as a header', async () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'settings',
        endpointVersion: 'v1',
        operations: ['get'],
      },
    });
    const client = clientBuilder(sdkConfig);

    await client.service.get(1);
    expect(mockAxiosClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'SDK-Version': version,
        }),
      }),
    );
  });
});

describe('SDK client configuration', () => {
  test('default config settings are applied to missing config properties', () => {
    const clientBuilder = createSdkClient({});
    const client = clientBuilder({ basicAuth: '' });
    expect(client.config).toStrictEqual({
      ...DEFAULT_CONFIG,
      basicAuth: '',
    });
  });

  test('default config settings can be overridden', () => {
    const clientBuilder = createSdkClient({});
    const client = clientBuilder({ basicAuth: '', baseUri: 'http://example.com' });
    expect(client.config).toStrictEqual({
      ...DEFAULT_CONFIG,
      basicAuth: '',
      baseUri: 'http://example.com',
    });
  });

  test('changing config properties with defaults to undefined will restore default values', () => {
    const clientBuilder = createSdkClient({});
    const client = clientBuilder({ basicAuth: '', baseUri: 'http://example.com' });
    client.config = {
      ...client.config,
      baseUri: undefined,
    };
    expect(client.config).toStrictEqual({
      ...DEFAULT_CONFIG,
      basicAuth: '',
    });
  });

  test('config is passed through to services', async () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'settings',
        endpointVersion: 'v1',
        operations: ['get'],
      },
    });
    const baseUri = 'http://example.com';
    const client = clientBuilder({ basicAuth: '', baseUri, retry: false });

    await client.service.get(1);
    expect(mockAxiosClient.getUri()).toBe(`${baseUri}/`);
  });

  test('config changes are reflected in services', async () => {
    const clientBuilder = createSdkClient({
      service: {
        endpoint: 'settings',
        endpointVersion: 'v1',
        operations: ['get'],
      },
    });
    const baseUri = 'http://example.com';
    const client = clientBuilder({ basicAuth: '', baseUri, retry: false });
    client.config = {
      ...client.config,
      baseUri: undefined,
    };

    await client.service.get(1);
    expect(mockAxiosClient.getUri()).toBe(new URL(DEFAULT_CONFIG.baseUri).toString());
  });
});
