import { EndpointEntityMap } from './endpoint.js';
import {
  Auth,
  Availability,
  DailyBudgets,
  DailyRevenue,
  Leave,
  LeaveType,
  ShiftHistoryRecord,
  Terminal,
  ToilAllowance,
  User,
  UserBreak,
  UserClockedIn,
  UserClockedOut,
} from './interfaces/index.js';
import { LaunchTerminal } from './interfaces/launch-terminal.interface.js';
import {
  OpDef,
  Operation,
  OperationContext,
  RequestConfig,
  createOp,
  listAllOp,
  listAllV2Op,
  listOp,
  listV2Op,
  paramsFromOptions,
} from './ops.js';
import { UserBreakRequest, UserClockIn, UserClockOut } from './interfaces/user-clock-in.interface.js';
import { RequirementsOf, RequestOptions } from './utils.js';
import { ShiftSwapRequest } from './interfaces/swap-request.interface.js';
import { ShiftDropRequest } from './interfaces/drop-request.interface.js';
import { ToilAllowanceQueryParams } from './interfaces/query-params/index.js';
import { LogbookEntry, LogbookQueryParameters } from './interfaces/logbook.interface.js';
import { Message } from './interfaces/message.interface.js';
import { Invoice, InvoiceDownload } from './interfaces/invoice.interface.js';
import { CreateUserRequest, CreateUserResponse, PartialUserV2 } from './interfaces/user-v2.interface.js';
import { AddOrOnboard, UpdateUserWithOnboardingInfo } from './interfaces/onboarding.interface.js';

export type ServiceSpecification<CustomOp extends OpDef<unknown> = OpDef<any>> = {
  /** Operations allowed and usable for the endpoint */
  operations: Operation[];
  /**
   * Operations unique to the service
   * Can be used to override operations listed in {@see ServiceSpecification['operations']}
   */
  customOperations?: Record<string, CustomOp>;
  subService?: Record<string, ServiceSpecification<CustomOp>>;
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
  | {
      endpoint: string;
      endpointVersion: 'v1' | 'v2';
      /**
       * Marks the endpoint as one not defined in the {@link EndpointEntityMap}
       *
       * Intended for defining customOperations
       * */
      custom: true;
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
    operations: [],
    customOperations: {
      get: ({ request, service }): RequestConfig<void, Auth> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}`,
        method: 'GET',
      }),
    },
  },
  availability: {
    endpoint: 'availability',
    endpointVersion: 'v1',
    operations: ['update', 'create', 'delete', 'list', 'listAll'],
    customOperations: {
      update: ({ request, service }, entity: Availability): RequestConfig<typeof entity, Availability> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: entity,
      }),
      delete: (
        { request, service },
        entity: { user: number; dates: string[] },
      ): RequestConfig<Availability, Availability> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: {
          ...entity,
          dates: entity.dates.map((date) => ({
            date,
            available: [],
            unavailable: [],
          })),
        },
      }),
    },
  },
  dailyBudget: {
    endpoint: 'daily_budgets',
    endpointVersion: 'v1',
    operations: ['list', 'listAll', 'updateBatch'],
    customOperations: {
      updateBatch: ({ request, service }, entities: DailyBudgets[]): RequestConfig<typeof entities, void> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: entities,
      }),
    },
  },
  dailyRevenue: {
    endpoint: 'daily_revenue',
    endpointVersion: 'v1',
    operations: ['list', 'listAll', 'updateBatch'],
    customOperations: {
      updateBatch: ({ request, service }, entities: DailyRevenue[]): RequestConfig<typeof entities, void> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: entities,
      }),
    },
  },
  dayNote: {
    endpoint: 'day_notes',
    endpointVersion: 'v1',
    operations: ['get', 'create', 'list', 'listAll', 'update', 'delete'],
    subService: {
      v2: {
        endpoint: 'dayNotes',
        endpointVersion: 'v2',
        operations: ['get', 'create', 'list', 'listAll', 'update', 'delete'],
      },
    },
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
  invoice: {
    endpoint: 'invoices',
    endpointVersion: 'v2',
    operations: ['get', 'list', 'listAll'],
    customOperations: {
      get: (ctx, id: number): RequestConfig<void, Invoice & InvoiceDownload> => ({
        ...ctx.request,
        url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${id}`,
        method: 'GET',
      }),
    },
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
  leave: {
    endpoint: 'leave',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'listAll', 'delete', 'create', 'update'],
    customOperations: {
      create: (
        { request, service, sdkConfig }: OperationContext,
        entity: EndpointEntityMap['v1']['leave']['createType'],
        opts?: RequestOptions<Leave>,
      ): RequestConfig<typeof entity, Leave[]> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: entity,
        headers: {
          ...request.headers,
          Account: sdkConfig.accountId,
          User: entity.user,
        },
        params: {
          ...request.params,
          ...paramsFromOptions(opts ?? {}),
        },
      }),
      types: ({ request }): RequestConfig<void, LeaveType[]> => ({
        ...request,
        method: 'GET',
        url: 'v1/leave_types',
      }),
    },
  },
  location: {
    endpoint: 'locations',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  logbook: {
    endpoint: 'logbook',
    endpointVersion: 'v2',
    operations: ['create', 'get', 'delete', 'update'],
    customOperations: {
      list: (ctx, query: LogbookQueryParameters, opts) =>
        // Maps the "userId" query parameter into the endpoint URL
        listV2Op<LogbookEntry, Omit<typeof query, 'userId'>>(
          {
            ...ctx,
            service: {
              ...ctx.service,
              endpoint: `${ctx.service.endpoint}/user/${query.userId}`,
              endpointVersion: 'v2',
              custom: true,
            },
          },
          { date: query.date },
          opts,
        ),
      listAll: (ctx, query: LogbookQueryParameters, opts) =>
        // Maps the "userId" query parameter into the endpoint URL
        listAllV2Op<LogbookEntry, Omit<typeof query, 'userId'>>(
          {
            ...ctx,
            service: {
              ...ctx.service,
              endpoint: `${ctx.service.endpoint}/user/${query.userId}`,
              endpointVersion: 'v2',
              custom: true,
            },
          },
          { date: query.date },
          opts,
        ),
    },
    subService: {
      category: {
        endpoint: 'logbook/categories',
        endpointVersion: 'v2',
        operations: ['get', 'create', 'update', 'delete', 'list', 'listAll'],
      },
    },
  },
  message: {
    endpoint: 'messages',
    endpointVersion: 'v1',
    operations: ['list', 'listAll', 'listByPage'],
    customOperations: {
      send: (ctx, message: EndpointEntityMap['v1']['messages']['createType']) => createOp<Message>(ctx, message),
    },
  },
  pin: {
    endpoint: 'pins',
    endpointVersion: 'v1',
    operations: ['get'],
  },
  role: {
    endpoint: 'roles',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'delete'],
  },
  settings: {
    endpoint: 'settings',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
  },
  shift: {
    endpoint: 'shifts',
    endpointVersion: 'v1',
    operations: ['create', 'get', 'list', 'listAll', 'update', 'updateBatch', 'delete', 'deleteBatch'],
    customOperations: {
      acknowledge: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'POST',
        url: 'v1/shifts_acknowledged',
        data: { shifts: shiftIds },
      }),
      history: ({ request, service }, id: number): RequestConfig<void, ShiftHistoryRecord[]> => ({
        ...request,
        method: 'GET',
        url: `v1/${service.endpoint}/${id}/history`,
      }),
      publish: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'POST',
        url: 'v1/shifts_published',
        data: { shifts: shiftIds },
      }),
      unpublish: ({ request }, shiftIds: number[]): RequestConfig<{ shifts: number[] }, void> => ({
        ...request,
        method: 'DELETE',
        url: 'v1/shifts_published',
        data: { shifts: shiftIds },
      }),
      updateSwap: (
        { request },
        swapRequest: RequirementsOf<ShiftSwapRequest, 'id'>,
      ): RequestConfig<{ admin_approved: boolean } | { user_approved: boolean }, ShiftSwapRequest> => {
        let payload: { admin_approved: boolean } | { user_approved: boolean } | undefined;
        if (swapRequest.admin_approved !== null && swapRequest.admin_approved !== undefined) {
          payload = { admin_approved: swapRequest.admin_approved };
        } else if (swapRequest.user_approved !== null && swapRequest.user_approved !== undefined) {
          payload = { user_approved: swapRequest.user_approved };
        }

        return {
          ...request,
          method: 'POST',
          url: `v1/swap_requests/${swapRequest.id}`,
          data: payload,
        };
      },
      updateDrop: (
        { request },
        dropRequest: { request: RequirementsOf<ShiftDropRequest, 'id' | 'user_message'>; approved: boolean },
      ): RequestConfig<{ message: string }, ShiftDropRequest> => ({
        ...request,
        method: 'POST',
        url: `v1/unavailability_requests/${dropRequest.request.id}/${dropRequest.approved ? 'approve' : 'deny'}`,
        data: { message: dropRequest.request.user_message },
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
        url: `${service.endpointVersion}/${service.endpoint}/${id}`,
      }),
    },
  },
  terminalActive: {
    endpoint: 'terminals_active',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
    customOperations: {
      launch: ({ request, service }, terminal: LaunchTerminal): RequestConfig<LaunchTerminal, Terminal> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}`,
        data: terminal,
      }),
      ping: (
        { request, service },
        terminal: { id: number; action: string; device: string },
      ): RequestConfig<Omit<typeof terminal, 'id'>, void> => ({
        ...request,
        method: 'POST',
        url: `${service.endpointVersion}/${service.endpoint}/${terminal.id}`,
        data: { action: terminal.action, device: terminal.device },
      }),
      close: ({ request, service }, id: number): RequestConfig<void, void> => ({
        ...request,
        method: 'DELETE',
        url: `${service.endpointVersion}/${service.endpoint}/${id}`,
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
    operations: ['create', 'get', 'list', 'listAll', 'listByPage', 'delete'],
  },
  toilAllowance: {
    endpoint: 'toil_allowance',
    endpointVersion: 'v1',
    operations: ['list', 'listAll'],
    customOperations: {
      list: (ctx, query: ToilAllowanceQueryParams, opts) =>
        // Maps the "year" query parameter into the endpoint URL
        listOp<ToilAllowance, Omit<typeof query, 'year'>>(
          {
            ...ctx,
            service: {
              ...ctx.service,
              endpoint: `${ctx.service.endpoint}/${query.year}`,
              endpointVersion: 'v1',
              custom: true,
            },
          },
          { users: query.users },
          opts,
        ),
      listAll: (ctx, query: ToilAllowanceQueryParams, opts) =>
        // Maps the "year" query parameter into the endpoint URL
        listAllOp<ToilAllowance, Omit<typeof query, 'year'>>(
          {
            ...ctx,
            service: {
              ...ctx.service,
              endpoint: `${ctx.service.endpoint}/${query.year}`,
              endpointVersion: 'v1',
              custom: true,
            },
          },
          { users: query.users },
          opts,
        ),
    },
  },
  userClockIn: {
    endpoint: 'users_clocked_in',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'listAll'],
    customOperations: {
      clockIn: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserClockIn, 'method'>,
      ): RequestConfig<typeof entity, UserClockedIn> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      clockOut: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserClockOut, 'method'>,
      ): RequestConfig<typeof entity, UserClockedOut> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      startBreak: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserBreakRequest, 'method' | 'action'>,
      ): RequestConfig<typeof entity, UserBreak> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}/${entity.id}`,
        method: 'POST',
        data: entity,
      }),
      endBreak: (
        { request, service },
        entity: { id: number } & RequirementsOf<UserBreakRequest, 'method' | 'action'>,
      ): RequestConfig<typeof entity, UserBreak> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}/${entity.id}`,
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
  userV2: {
    endpoint: 'users',
    endpointVersion: 'v2',
    operations: ['create'],
    customOperations: {
      create: (
        { request, service },
        userSpec: {
          users: RequirementsOf<CreateUserRequest, 'firstName' | 'lastName' | 'roles'>[];
          sendInvite?: boolean;
        },
      ): RequestConfig<typeof userSpec, CreateUserResponse> => ({
        ...request,
        url: `${service.endpointVersion}/${service.endpoint}`,
        method: 'POST',
        data: userSpec,
      }),
    },
  },
  // onboarding: {
  //   endpoint: 'users/onboard',
  //   endpointVersion: 'v2',
  //   operations: ['update', 'create'],
  //   customOperations: {
  //     update: (
  //       { request, service },
  //       onboardingInfoForm: UpdateUserWithOnboardingInfo,
  //     ): RequestConfig<typeof onboardingInfoForm, void> => ({
  //       ...request,
  //       url: `${service.endpointVersion}/${service.endpoint}`,
  //       method: 'PATCH',
  //       data: onboardingInfoForm,
  //     }),
  //     create: ({ request, service }, addOrOnboard: AddOrOnboard): RequestConfig<typeof addOrOnboard, void> => ({
  //       ...request,
  //       url: `${service.endpointVersion}/${service.endpoint}`,
  //       method: 'POST',
  //       data: addOrOnboard,
  //     }),
  //   },
  // },
  // resendOnboardingLink: {
  //   endpoint: 'users/onboard/resend',
  //   endpointVersion: 'v2',
  //   operations: ['create'],
  //   customOperations: {
  //     create: ({ request, service }, entity: { id: number }): RequestConfig<void, void> => ({
  //       ...request,
  //       url: `${service.endpointVersion}/${service.endpoint}/${entity.id}/resend`,
  //       method: 'POST',
  //     }),
  //   },
  // },
} satisfies Record<string, ServiceSpecification>;
