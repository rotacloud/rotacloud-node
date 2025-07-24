import {
  Account,
  Attendance,
  Auth,
  Availability,
  DailyBudgets,
  DailyRevenue,
  DayNote,
  DaysOff,
  Group,
  Leave,
  Role,
  Shift,
  TimeZone,
  Document,
  LeaveEmbargo,
  LeaveRequest,
  LeaveType,
  Location,
  Pin,
  Terminal,
  ToilAccrual,
  ToilAllowance,
  UserClockedIn,
  User,
  Settings,
  LogbookCategory,
  DayNoteV2,
  DayNoteV2QueryParameters,
} from './interfaces/index.js';
import { LogbookEntry, LogbookQueryParameters } from './interfaces/logbook.interface.js';
import { Message } from './interfaces/message.interface.js';
import {
  AttendanceQueryParams,
  AvailabilityQueryParams,
  DailyBudgetsQueryParams,
  DailyRevenueQueryParams,
  DayNotesQueryParams,
  DaysOffQueryParams,
  DocumentsQueryParams,
  GroupsQueryParams,
  LeaveEmbargoesQueryParams,
  LeaveQueryParams,
  LeaveRequestsQueryParams,
  LocationsQueryParams,
  RolesQueryParams,
  SettingsQueryParams,
  ShiftsQueryParams,
  TerminalsQueryParams,
  ToilAccrualsQueryParams,
  ToilAllowanceQueryParams,
  UsersQueryParams,
} from './interfaces/query-params/index.js';
import { RequirementsOf } from './utils.js';
import { Invoice, InvoiceQueryParameters } from './interfaces/invoice.interface.js';

/** Endpoint versions supported by the API */
export type EndpointVersion = 'v1' | 'v2';
/** Associated types for a given API endpoint */
export type Endpoint<
  Entity,
  QueryParameters = undefined,
  CreateEntity extends keyof Entity | object = any,
  // NOTE: introduced to work around TS inferring `RequirementsOf<Entity, CreateEntity>` incorrectly
  // TS resolves type to:
  // `RequirementsOf<Entity, "key 1"> | RequirementsOf<Entity "key 2">`
  // instead of:
  // `RequirementsOf<Entity, "key 1" | "key 2">`
  RequiredFields extends keyof Entity = CreateEntity extends keyof Entity ? CreateEntity : never,
> = {
  /** The type returned by an endpoint */
  type: Entity;
  /** The query parameters for endpoints that support listing */
  queryParameters: QueryParameters;
  /** The entity type required for endpoints that support creation */
  createType: CreateEntity extends keyof Entity ? RequirementsOf<Entity, RequiredFields> : CreateEntity;
};

/** Mapping between a endpoint URL and it's associated entity type
 *
 * Keys of each version map should be the URL of a given endpoint
 */
export interface EndpointEntityMap extends Record<EndpointVersion, Record<string, Endpoint<unknown, any>>> {
  /** Type mappings for v1 endpoints */
  v1: {
    accounts: Endpoint<Account>;
    attendance: Endpoint<Attendance, AttendanceQueryParams, 'user' | 'in_time'>;
    auth: Endpoint<Auth>;
    availability: Endpoint<Availability, AvailabilityQueryParams>;
    daily_budgets: Endpoint<DailyBudgets, DailyBudgetsQueryParams>;
    daily_revenue: Endpoint<DailyRevenue, DailyRevenueQueryParams>;
    day_notes: Endpoint<DayNote, DayNotesQueryParams>;
    days_off: Endpoint<DaysOff, DaysOffQueryParams>;
    documents: Endpoint<Document, DocumentsQueryParams, 'name' | 'bucket' | 'key'>;
    groups: Endpoint<Group, GroupsQueryParams, 'name'>;
    leave_embargoes: Endpoint<LeaveEmbargo, LeaveEmbargoesQueryParams, 'start_date' | 'end_date' | 'users'>;
    leave_requests: Endpoint<LeaveRequest, LeaveRequestsQueryParams, 'start_date' | 'end_date' | 'type' | 'user'>;
    leave_types: Endpoint<LeaveType>;
    leave: Endpoint<Leave, LeaveQueryParams, 'users' | 'type' | 'start_date' | 'end_date'>;
    locations: Endpoint<Location, LocationsQueryParams, 'name'>;
    messages: Endpoint<
      Message,
      undefined,
      Pick<Message, 'message' | 'subject'> & {
        users: number[];
        attachments?: Pick<Message['attachments'][number], 'key' | 'bucket' | 'name' | 'extension'>[];
      }
    >;
    pins: Endpoint<Pin>;
    roles: Endpoint<Role, RolesQueryParams, 'name'>;
    settings: Endpoint<Settings, SettingsQueryParams>;
    shifts: Endpoint<Shift, ShiftsQueryParams, 'start_time' | 'end_time' | 'location'>;
    terminals: Endpoint<Terminal, TerminalsQueryParams, 'name' | 'timezone'>;
    terminals_active: Endpoint<Terminal>;
    timezones: Endpoint<TimeZone>;
    toil_accruals: Endpoint<ToilAccrual, ToilAccrualsQueryParams, 'duration_hours' | 'leave_year' | 'user_id'>;
    toil_allowance: Endpoint<ToilAllowance, ToilAllowanceQueryParams>;
    users_clocked_in: Endpoint<UserClockedIn, undefined, 'in_method'>;
    users: Endpoint<User, UsersQueryParams, 'first_name' | 'last_name'>;
  };
  /** Type mappings for v2 endpoints */
  v2: {
    logbook: Endpoint<LogbookEntry, LogbookQueryParameters, 'name' | 'description' | 'date' | 'userId'>;
    invoices: Endpoint<Invoice, InvoiceQueryParameters>;
    dayNotes: Endpoint<
      DayNoteV2,
      DayNoteV2QueryParameters,
      'title' | 'message' | 'startDate' | 'endDate' | 'locations' | 'visibleToEmployees'
    >;
    'logbook/categories': Endpoint<LogbookCategory, undefined, Pick<LogbookCategory, 'name'>>;
  };
}
