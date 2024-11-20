import { Settings } from 'http2';
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
} from './interfaces/index.js';
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

type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;
export type EndpointVersion = 'v1' | 'v2';
export interface Endpoint<
  Entity = unknown,
  QueryParameters extends object = any,
  RequiredFields extends keyof Entity = any,
> {
  type: Entity;
  queryParameters: QueryParameters;
  createType: RequirementsOf<Entity, RequiredFields>;
}

/** Mapping between a endpoint URL and it's associated entity type */
export interface EndpointEntityMap extends Record<EndpointVersion, Record<string, Endpoint>> {
  /** Type mappings for v1 endpoints  */
  v1: {
    accounts: Endpoint<Account>;
    attendance: Endpoint<Attendance, AttendanceQueryParams, 'user' | 'in_time'>;
    auth: Endpoint<Auth>;
    availability: Endpoint<Availability, AvailabilityQueryParams>;
    daily_budget: Endpoint<DailyBudgets, DailyBudgetsQueryParams>;
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
    pins: Endpoint<Pin>;
    roles: Endpoint<Role, RolesQueryParams, 'name'>;
    settings: Endpoint<Settings, SettingsQueryParams>;
    shifts: Endpoint<Shift, ShiftsQueryParams, 'start_time' | 'end_time' | 'location'>;
    terminals: Endpoint<Terminal, TerminalsQueryParams, 'name' | 'timezone'>;
    terminals_active: Endpoint<Terminal>;
    timezones: Endpoint<TimeZone>;
    toil_accruals: Endpoint<ToilAccrual, ToilAccrualsQueryParams, 'duration_hours' | 'leave_year' | 'user_id'>;
    toil_allowance: Endpoint<ToilAllowance, ToilAllowanceQueryParams>;
    // TODO: fixup
    users_clocked_in: Endpoint<UserClockedIn, never, 'in_method'>;
    users: Endpoint<User, UsersQueryParams, 'first_name' | 'last_name'>;
  };
  /** Type mappings for v2 endpoints */
  v2: {};
}
