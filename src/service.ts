import { EndpointEntityMap } from './endpoint.js';
import { LeaveRequest, Terminal } from './interfaces/index.js';
import { Options } from './fetchv2.js';
import { LaunchTerminal } from './interfaces/launch-terminal.interface.js';
import { Op, Operation, OpFactoryOptions, paramsFromOptions } from './ops.js';

export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;

export type ServiceSpecification = {
  /** Operations allowed and usable for the endpoint */
  operations: Operation[];
  /**
   * Operations unique to the service
   * Can be used to override operations listed in {@see ServiceSpecification['operations']}
   */
  customOperations?: Record<string, Op<any>>;
} & (
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v1'];
      /** API version of the endpoint */
      endpointVersion: 'v1';
    }
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v2'];
      /** API version of the endpoint */
      endpointVersion: 'v2';
    }
);

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
      // create: (
      //   { request, service }: OpFactoryOptions,
      //   entity: RequirementsOf<LeaveRequest, 'user'>,
      //   opts?: Options<LeaveRequest>,
      // ) => ({
      //   ...request,
      //   method: 'POST',
      //   url: service.endpoint,
      //   data: entity,
      //   headers: {
      //     ...request.headers,
      //     Account: undefined,
      //     User: entity.user,
      //   },
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
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
      // acknowledge: ({ request }, shiftIds: number[], opts?: Options<void>) => ({
      //   ...request,
      //   method: 'POST',
      //   url: '/shifts_acknowledged',
      //   data: { shifts: shiftIds },
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
      // publish: ({ request }, shiftIds: number[], opts?: Options<void>) => ({
      //   ...request,
      //   method: 'POST',
      //   url: '/shifts_published',
      //   data: { shifts: shiftIds },
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
      // unpublish: ({ request }, shiftIds: number[], opts?: Options<void>) => ({
      //   ...request,
      //   method: 'DELETE',
      //   url: '/shifts_published',
      //   data: { shifts: shiftIds },
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
    },
  },
  terminal: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'update', 'list', 'listAll'],
    customOperations: {
      // close: ({ request, service }, id: number, opts?: Options<void>) => ({
      //   ...request,
      //   method: 'DELETE',
      //   url: `/${service.endpoint}/${id}`,
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
    },
  },
  terminalActive: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
    customOperations: {
      // launch: ({ request, service }, id: LaunchTerminal, opts?: Options<Terminal>) => ({
      //   ...request,
      //   method: 'DELETE',
      //   url: `/${service.endpoint}/${id}`,
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
      // ping: ({ request, service }, id: { id: number; action: string; device: string }, opts?: Options<void>) => ({
      //   ...request,
      //   method: 'DELETE',
      //   url: `${service.endpoint}/${id}`,
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
      // close: ({ request, service }, id: number, opts?: Options<void>) => ({
      //   ...request,
      //   method: 'DELETE',
      //   url: `${service.endpoint}/${id}`,
      //   params: {
      //     ...request.params,
      //     ...paramsFromOptions(opts ?? {}),
      //   },
      // }),
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
