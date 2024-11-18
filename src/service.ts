import assert from 'assert';
import { EndpointEntityMap } from './endpoint.js';
import { Operation, OpFunctionFactory } from './ops.js';

export type ServiceSpecification =
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v1'];
      /** API version of the endpoint */
      endpointVersion: 'v1';
      /** Operations allowed and usable for the endpoint */
      operations: Operation[];
      /**
       * Operations unique to the serive
       * Can be used to override operations listed in {@see ServiceSpecification['operations']}
       */
      customOperations?: Record<string, OpFunctionFactory>;
    }
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v2'];
      /** API version of the endpoint */
      endpointVersion: 'v2';
      /** Operations allowed and usable for the endpoint */
      operations: Operation[];
      /**
       * Operations unique to the serive
       * Can be used to override operations listed in {@see ServiceSpecification['operations']}
       */
      customOperations?: Record<string, OpFunctionFactory>;
    };

/**
 * List of all supported service specifications
 * used to generate the SDK client
 */
export const SERVICES = {
  account: {
    endpoint: 'accounts',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'listAll'],
  },
  attendance: {
    endpoint: 'attendance',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'listAll', 'delete', 'create', 'update'],
  },
  auth: {
    endpoint: 'auth',
    endpointVersion: 'v1',
    operations: ['get'],
  },
  availability: {
    endpoint: 'availability',
    endpointVersion: 'v1',
    operations: ['update', 'create', 'delete', 'list', 'listAll'],
  },
  dailyBudget: {
    endpoint: 'daily_budget',
    endpointVersion: 'v1',
    operations: ['list', 'listAll', 'update'],
  },
  dailyRevenue: {
    endpoint: 'daily_revenue',
    endpointVersion: 'v1',
    operations: ['list', 'listAll', 'update'],
  },
  dayNote: {
    endpoint: 'day_notes',
    endpointVersion: 'v1',
    operations: ['get', 'create', 'list', 'listAll', 'update', 'delete'],
  },
  dayOff: {
    endpoint: 'days_off',
    endpointVersion: 'v1',
    operations: ['create', 'list', 'listAll', 'delete'],
  },
  document: {
    endpoint: 'documents',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  group: {
    endpoint: 'groups',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  leaveEmbargo: {
    endpoint: 'leave_embargoes',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  leaveRequest: {
    endpoint: 'leave_requests',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  leaveType: {
    endpoint: 'leave_types',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
  },
  leave: {
    endpoint: 'leave',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'delete', 'create'],
    customOperations: {
      //   create:
      //     ({ client, request, service }) =>
      //     async (entity: Partial<LeaveRequest>, opts?: Options<LeaveRequest>) => {
      //       const modifiedRequest = {
      //         ...request,
      //         headers: {
      //           ...request.headers,
      //           Account: undefined,
      //           User: entity.user,
      //         },
      //         params: {
      //           ...request.params,
      //           ...paramsFromOptions(opts ?? {}),
      //         },
      //       };
      //       assert(request.headers !== undefined, 'Invalid create leave request');
      //       const res = await client.post<LeaveRequest>(service.endpoint, entity, modifiedRequest);
      //
      //       if (opts?.rawResponse) return res;
      //       return res.data;
      //     },
    },
  },
  location: {
    endpoint: 'locations',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  pin: {
    endpoint: 'pins',
    endpointVersion: 'v1',
    operations: ['get'],
  },
  role: {
    endpoint: 'roles',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'delete'],
  },
  settings: {
    endpoint: 'settings',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
  },
  shift: {
    endpoint: 'shifts',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
    customOperations: {
      //   acknowledge: () => undefined,
      //   publish: () => undefined,
      //   unpublish: () => undefined,
    },
  },
  terminal: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'update', 'list', 'listAll'],
    customOperations: {
      // close: () => undefined
    },
  },
  terminalActive: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
    customOperations: {
      // launch: () => undefined
      // ping: () => undefined
      // close: () => undefined
    },
  },
  timeZone: {
    endpoint: 'timezones',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'listAll'],
  },
  toilAccrual: {
    endpoint: 'toil_accruals',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'delete'],
  },
  toilAllowance: {
    endpoint: 'toil_allowance',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
  },
  userClockIn: {
    endpoint: 'users_clocked_in',
    endpointVersion: 'v1',
    // TODO: check types
    operations: ['get', 'list', 'listAll'],
    customOperations: {
      // clockIn: () => undefined
      // clockOut: () => undefined
      // startBreak: () => undefined
      // endBreak: () => undefined
    },
  },
  user: {
    endpoint: 'users',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
} satisfies Record<string, ServiceSpecification>;
