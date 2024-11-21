import { EndpointEntityMap } from './endpoint.js';
import { LeaveRequest, Terminal, UserBreak, UserClockedIn, UserClockedOut } from './interfaces/index.js';
import { RequestOptions } from './fetchv2.js';
import { LaunchTerminal } from './interfaces/launch-terminal.interface.js';
import { OpDef, Operation, OperationContext, RequestConfig, paramsFromOptions } from './ops.js';
import { UserBreakRequest, UserClockIn } from './interfaces/user-clock-in.interface.js';
import { RequirementsOf } from './utils.js';

export type ServiceSpecification<T extends OpDef<any> = any> = {
  /** Operations allowed and usable for the endpoint */
  operations: Operation[];
  /**
   * Operations unique to the service
   * Can be used to override operations listed in {@see ServiceSpecification['operations']}
   */
  customOperations?: Record<string, T>;
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
 * Map of all officially supported service specifications used to generate the
 * SDK client where each key is the service name and each value is the service
 * definition conforming to the {@see ServiceSpecification} type
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
      create: (
        { request, service }: OperationContext,
        entity: RequirementsOf<LeaveRequest, 'user'>,
        opts?: RequestOptions<LeaveRequest>,
      ): RequestConfig<typeof entity, LeaveRequest> => ({
        ...request,
        method: 'POST',
        url: service.endpoint,
        data: entity,
        headers: {
          ...request.headers,
          Account: undefined,
          User: entity.user,
        },
        params: {
          ...request.params,
          ...paramsFromOptions(opts ?? {}),
        },
      }),
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
      acknowledge: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'POST',
        url: '/shifts_acknowledged',
        data: { shifts: shiftIds },
      }),
      publish: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'POST',
        url: '/shifts_published',
        data: { shifts: shiftIds },
      }),
      unpublish: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'DELETE',
        url: '/shifts_published',
        data: { shifts: shiftIds },
      }),
    },
  },
  terminal: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'update', 'list', 'listAll'],
    customOperations: {
      close: ({ request, service }, id: number): RequestConfig<void, void> => ({
        ...request,
        method: 'DELETE',
        url: `/${service.endpoint}/${id}`,
      }),
    },
  },
  terminalActive: {
    endpoint: 'terminals',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
    customOperations: {
      launch: ({ request, service }, id: LaunchTerminal): RequestConfig<void, Terminal> => ({
        ...request,
        method: 'DELETE',
        url: `/${service.endpoint}/${id}`,
      }),
      ping: ({ request, service }, id: { id: number; action: string; device: string }): RequestConfig<void, void> => ({
        ...request,
        method: 'DELETE',
        url: `${service.endpoint}/${id}`,
      }),
      close: ({ request, service }, id: number): RequestConfig<void, void> => ({
        ...request,
        method: 'DELETE',
        url: `${service.endpoint}/${id}`,
      }),
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
    operations: ['get', 'list', 'listAll'],
    customOperations: {
      // TODO: check types
      clockIn: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserClockIn, 'method'>,
      ): RequestConfig<typeof entity, UserClockedIn> => ({
        ...request,
        url: `${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      clockOut: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserClockIn, 'method'>,
      ): RequestConfig<typeof entity, UserClockedOut> => ({
        ...request,
        url: `${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      startBreak: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserBreakRequest, 'method' | 'action'>,
      ): RequestConfig<typeof entity, UserBreak> => ({
        ...request,
        url: `${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      endBreak: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserBreakRequest, 'method' | 'action'>,
      ): RequestConfig<typeof entity, UserBreak> => ({
        ...request,
        url: `${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
    },
  },
  user: {
    endpoint: 'users',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
} satisfies Record<string, ServiceSpecification>;
