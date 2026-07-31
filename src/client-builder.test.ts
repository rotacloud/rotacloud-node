import { test, expect, describe, vi } from 'vitest';
import { Axios } from 'axios';
import { createSdkClient, DEFAULT_CONFIG } from './client-builder.js';
import { SDKConfig, ShiftV2 } from './interfaces/index.js';
import type { ManagerShiftDropResponse, ShiftDropResponse, ShiftSwapResponse } from './generated/api-types.js';
import { ShiftsV2QueryParams } from './interfaces/query-params/index.js';
import { SERVICES } from './service.js';
import pkg from '../package.json' with { type: 'json' };

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
  test('models the V2 shift request responses from the API contract', () => {
    const employeeSwapRequest = {
      id: 1,
      status: 'requested',
      requestedAt: '2026-07-28T00:00:00.000Z',
      userRepliedAt: null,
      adminRepliedAt: null,
      oldUserId: 1,
      newUserId: 2,
      adminId: null,
      userApproved: null,
      adminApproved: null,
      shiftId: 1,
      swappedShiftId: 2,
    } satisfies ShiftSwapResponse;
    const employeeDropRequest = {
      id: 2,
      status: 'requested',
      requestedAt: '2026-07-28T00:00:00.000Z',
      repliedAt: null,
      userId: 1,
      adminId: null,
      userMessage: 'Unable to work',
      adminMessage: '',
      shiftId: 1,
    } satisfies ShiftDropResponse;
    const managerDropRequest = {
      ...employeeDropRequest,
      isDeleted: true,
      deletedAt: '2026-07-28T00:00:00.000Z',
      deletedBy: 7,
    } satisfies ManagerShiftDropResponse;
    const shift = {
      id: 1,
      published: true,
      open: false,
      userId: 1,
      locationId: 1,
      roleId: 1,
      startTime: '2026-07-28T09:00:00.000Z',
      endTime: '2026-07-28T17:00:00.000Z',
      minutesBreak: 30,
      createdAt: '2026-07-27T00:00:00.000Z',
      claimOpenShiftApprovalRequired: false,
    } satisfies Omit<ShiftV2, 'dropRequests' | 'swapRequests'>;
    const managerShift = {
      ...shift,
      swapRequests: [employeeSwapRequest],
      dropRequests: [managerDropRequest],
    } satisfies ShiftV2;
    const employeeShift = {
      ...shift,
      swapRequests: [employeeSwapRequest],
      dropRequests: [employeeDropRequest],
    } satisfies ShiftV2;

    expect(managerShift.dropRequests[0]).toHaveProperty('isDeleted', true);
    expect(employeeShift.swapRequests[0]).not.toHaveProperty('isDeleted');
    expect(employeeShift.dropRequests[0]).not.toHaveProperty('isDeleted');
  });

  test('V2 shift queries require complete shift or creation date ranges', () => {
    const shiftDateRange = {
      start: '2026-07-20T00:00:00.000Z',
      end: '2026-07-27T00:00:00.000Z',
    } satisfies ShiftsV2QueryParams;
    const creationDateRange = {
      createdAtStart: '2026-07-20T00:00:00.000Z',
      createdAtEnd: '2026-07-27T00:00:00.000Z',
    } satisfies ShiftsV2QueryParams;
    const bothDateRanges = {
      ...shiftDateRange,
      ...creationDateRange,
    } satisfies ShiftsV2QueryParams;

    // @ts-expect-error A date range is required.
    const empty = {} satisfies ShiftsV2QueryParams;
    // @ts-expect-error A shift date range requires both boundaries.
    const partialShiftRange = { start: shiftDateRange.start } satisfies ShiftsV2QueryParams;
    // @ts-expect-error A creation date range requires both boundaries.
    const partialCreationRange: ShiftsV2QueryParams = {
      createdAtStart: creationDateRange.createdAtStart,
    };
    // @ts-expect-error A second date range cannot be partial.
    const completeAndPartialRanges: ShiftsV2QueryParams = {
      ...shiftDateRange,
      createdAtStart: creationDateRange.createdAtStart,
    };

    expect([shiftDateRange, creationDateRange, bothDateRanges]).toHaveLength(3);
    expect([empty, partialShiftRange, partialCreationRange, completeAndPartialRanges]).toHaveLength(4);
  });

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
          customOp: async () => {},
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

  test('adds V2 shift listing without changing the existing V1 shift service', async () => {
    const client = createSdkClient({ shift: SERVICES.shift })(sdkConfig);
    vi.spyOn(mockAxiosClient, 'request')
      .mockResolvedValueOnce({ data: [], headers: {} })
      .mockResolvedValueOnce({
        data: { data: [], pagination: { next: null, count: null } },
      });

    expect(client.shift).toMatchObject({
      create: expect.any(Function),
      get: expect.any(Function),
      list: expect.any(Function),
      listAll: expect.any(Function),
      update: expect.any(Function),
      updateBatch: expect.any(Function),
      delete: expect.any(Function),
      deleteBatch: expect.any(Function),
      acknowledge: expect.any(Function),
      history: expect.any(Function),
      publish: expect.any(Function),
      unpublish: expect.any(Function),
      updateSwap: expect.any(Function),
      updateDrop: expect.any(Function),
      v2: {
        list: expect.any(Function),
        listAll: expect.any(Function),
      },
    });

    await client.shift.list({ start: 1, end: 2 }).next();
    await client.shift.v2
      .list({
        start: '2026-07-20T00:00:00.000Z',
        end: '2026-07-27T00:00:00.000Z',
        createdBy: [7],
        hasNotes: true,
      })
      .next();

    expect(mockAxiosClient.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: 'v1/shifts',
        params: expect.objectContaining({ start: 1, end: 2 }),
      }),
    );
    expect(mockAxiosClient.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: 'v2/shifts',
        params: expect.objectContaining({
          start: '2026-07-20T00:00:00.000Z',
          end: '2026-07-27T00:00:00.000Z',
          createdBy: [7],
          hasNotes: true,
        }),
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
          'SDK-Version': pkg.version,
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
