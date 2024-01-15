import axios, { AxiosError, isAxiosError } from 'axios';
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
  TimeZoneService,
  ToilAccrualsService,
  ToilAllowanceService,
  UsersService,
  UsersClockInService,
} from './services/index.js';
import { SDKBase, SDKConfig } from './interfaces/index.js';
import { PinsService } from './services/pins.service.js';
import { SDKError } from './models/index.js';

const DEFAULT_CONFIG: Partial<SDKBase> = {
  baseUri: 'https://api.rotacloud.com/v1',
  retry: RetryStrategy.Exponential,
};

function parseClientError(error: AxiosError): SDKError | unknown {
  const axiosErrorLocation = error.response || error.request;
  const apiErrorMessage = axiosErrorLocation.data?.error;
  return new SDKError({
    code: axiosErrorLocation.status,
    message: apiErrorMessage || error.message,
    data: axiosErrorLocation.data,
  });
}

export class RotaCloud {
  static config: SDKConfig;
  private client = axios.create();

  defaultAPIURI = DEFAULT_CONFIG.baseUri;
  accounts = new AccountsService(this.client);
  attendance = new AttendanceService(this.client);
  auth = new AuthService(this.client);
  availability = new AvailabilityService(this.client);
  dailyBudgets = new DailyBudgetsService(this.client);
  dailyRevenue = new DailyRevenueService(this.client);
  dayNotes = new DayNotesService(this.client);
  daysOff = new DaysOffService(this.client);
  group = new GroupsService(this.client);
  leaveEmbargoes = new LeaveEmbargoesService(this.client);
  leaveRequests = new LeaveRequestService(this.client);
  leaveTypes = new LeaveTypesService(this.client);
  leave = new LeaveService(this.client);
  locations = new LocationsService(this.client);
  pins = new PinsService(this.client);
  roles = new RolesService(this.client);
  settings = new SettingsService(this.client);
  shifts = new ShiftsService(this.client);
  terminals = new TerminalsService(this.client);
  terminalsActive = new TerminalsActiveService(this.client);
  timeZone = new TimeZoneService(this.client);
  toilAccruals = new ToilAccrualsService(this.client);
  toilAllowance = new ToilAllowanceService(this.client);
  usersClockInService = new UsersClockInService(this.client);
  users = new UsersService(this.client);

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
    this.client.interceptors.request.clear();
    this.client.interceptors.response.clear();
    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        let parsedError = error;
        if (isAxiosError(error)) {
          parsedError = parseClientError(error);
        }
        return Promise.reject(parsedError);
      },
    );
    for (const requestInterceptor of this.config.interceptors?.request ?? []) {
      const callbacks =
        typeof requestInterceptor === 'function'
          ? ([requestInterceptor] as const)
          : ([requestInterceptor?.success, requestInterceptor?.error] as const);
      this.client.interceptors.request.use(...callbacks);
    }
    for (const responseInterceptor of this.config.interceptors?.response ?? []) {
      const callbacks =
        typeof responseInterceptor === 'function'
          ? ([responseInterceptor] as const)
          : ([responseInterceptor?.success, responseInterceptor?.error] as const);
      this.client.interceptors.response.use(...callbacks);
    }
  }
}

export { RetryStrategy, RetryOptions } from './services/service.js';
export * from './interfaces/index.js';
export * from './interfaces/query-params/index.js';
export * from './models/index.js';
