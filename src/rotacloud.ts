import {
  AccountsService,
  AttendanceService,
  AuthService,
  AvailabilityService,
  DailyBudgetsService,
  DailyRevenueService,
  DayNotesService,
  DaysOffService,
  GroupsService,
  LeaveEmbargoesService,
  LeaveRequestService,
  LeaveTypesService,
  LeaveService,
  LocationsService,
  RetryStrategy,
  RolesService,
  SettingsService,
  ShiftsService,
  TerminalsService,
  TerminalsActiveService,
  ToilAccrualsService,
  ToilAllowanceService,
  UsersService,
  UsersClockInService,
} from './services/index.js';
import { SDKConfig } from './interfaces/index.js';

const DEFAULT_CONFIG: Partial<SDKConfig> = {
  baseUri: 'https://api.rotacloud.com/v1',
  retry: RetryStrategy.Exponential,
};

export class RotaCloud {
  public static config: SDKConfig;

  public defaultAPIURI = DEFAULT_CONFIG.baseUri;
  public accounts = new AccountsService();
  public attendance = new AttendanceService();
  public auth = new AuthService();
  public availability = new AvailabilityService();
  public dailyBudgets = new DailyBudgetsService();
  public dailyRevenue = new DailyRevenueService();
  public dayNotes = new DayNotesService();
  public daysOff = new DaysOffService();
  public group = new GroupsService();
  public leaveEmbargoes = new LeaveEmbargoesService();
  public leaveRequests = new LeaveRequestService();
  public leaveTypes = new LeaveTypesService();
  public leave = new LeaveService();
  public locations = new LocationsService();
  public roles = new RolesService();
  public settings = new SettingsService();
  public shifts = new ShiftsService();
  public terminals = new TerminalsService();
  public terminalsActive = new TerminalsActiveService();
  public toilAccruals = new ToilAccrualsService();
  public toilAllowance = new ToilAllowanceService();
  public usersClockInService = new UsersClockInService();
  public users = new UsersService();

  constructor(config: SDKConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  get config() {
    return RotaCloud.config;
  }

  set config(configVal: SDKConfig) {
    RotaCloud.config = configVal;
  }
}

export { RetryStrategy, RetryOptions } from './services/service.js';
export * from './interfaces/index.js';
export * from './interfaces/query-params/index.js';
export * from './models/index.js';
