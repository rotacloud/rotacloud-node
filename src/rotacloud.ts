import axios, { AxiosError, isAxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
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
import { RetryOptions, RetryStrategy, SDKBase, SDKConfig } from './interfaces/index.js';
import { PinsService } from './services/pins.service.js';
import { SDKError } from './models/index.js';

const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 2000;

const DEFAULT_RETRY_STRATEGY_OPTIONS: Record<RetryStrategy, RetryOptions> = {
  [RetryStrategy.Exponential]: {
    exponential: true,
    maxRetries: DEFAULT_RETRIES,
  },
  [RetryStrategy.Static]: {
    exponential: false,
    maxRetries: DEFAULT_RETRIES,
    delay: DEFAULT_RETRY_DELAY,
  },
};

const DEFAULT_CONFIG: Partial<SDKBase> = {
  baseUri: 'https://api.rotacloud.com/v1',
  retry: RetryStrategy.Exponential,
};

function parseClientError(error: AxiosError): SDKError {
  const axiosErrorLocation = error.response || error.request;
  const apiErrorMessage = axiosErrorLocation.data?.error;
  return new SDKError({
    code: axiosErrorLocation.status,
    message: apiErrorMessage || error.message,
    data: axiosErrorLocation.data,
  });
}

export class RotaCloud {
  private client = axios.create();
  private sdkConfig: SDKConfig;
  private logging: (...message: any[]) => void;

  defaultAPIURI = DEFAULT_CONFIG.baseUri;
  accounts: AccountsService;
  attendance: AttendanceService;
  auth: AuthService;
  availability: AvailabilityService;
  dailyBudgets: DailyBudgetsService;
  dailyRevenue: DailyRevenueService;
  dayNotes: DayNotesService;
  daysOff: DaysOffService;
  group: GroupsService;
  leaveEmbargoes: LeaveEmbargoesService;
  leaveRequests: LeaveRequestService;
  leaveTypes: LeaveTypesService;
  leave: LeaveService;
  locations: LocationsService;
  pins: PinsService;
  roles: RolesService;
  settings: SettingsService;
  shifts: ShiftsService;
  terminals: TerminalsService;
  terminalsActive: TerminalsActiveService;
  timeZone: TimeZoneService;
  toilAccruals: ToilAccrualsService;
  toilAllowance: ToilAllowanceService;
  usersClockInService: UsersClockInService;
  users: UsersService;

  constructor(config: SDKConfig) {
    const updatedConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.config = updatedConfig;

    this.accounts = new AccountsService(this.client, updatedConfig);
    this.attendance = new AttendanceService(this.client, updatedConfig);
    this.auth = new AuthService(this.client, updatedConfig);
    this.availability = new AvailabilityService(this.client, updatedConfig);
    this.dailyBudgets = new DailyBudgetsService(this.client, updatedConfig);
    this.dailyRevenue = new DailyRevenueService(this.client, updatedConfig);
    this.dayNotes = new DayNotesService(this.client, updatedConfig);
    this.daysOff = new DaysOffService(this.client, updatedConfig);
    this.group = new GroupsService(this.client, updatedConfig);
    this.leaveEmbargoes = new LeaveEmbargoesService(this.client, updatedConfig);
    this.leaveRequests = new LeaveRequestService(this.client, updatedConfig);
    this.leaveTypes = new LeaveTypesService(this.client, updatedConfig);
    this.leave = new LeaveService(this.client, updatedConfig);
    this.locations = new LocationsService(this.client, updatedConfig);
    this.pins = new PinsService(this.client, updatedConfig);
    this.roles = new RolesService(this.client, updatedConfig);
    this.settings = new SettingsService(this.client, updatedConfig);
    this.shifts = new ShiftsService(this.client, updatedConfig);
    this.terminals = new TerminalsService(this.client, updatedConfig);
    this.terminalsActive = new TerminalsActiveService(this.client, updatedConfig);
    this.timeZone = new TimeZoneService(this.client, updatedConfig);
    this.toilAccruals = new ToilAccrualsService(this.client, updatedConfig);
    this.toilAllowance = new ToilAllowanceService(this.client, updatedConfig);
    this.usersClockInService = new UsersClockInService(this.client, updatedConfig);
    this.users = new UsersService(this.client, updatedConfig);
  }

  get config() {
    return this.sdkConfig;
  }

  set config(configVal: SDKConfig) {
    this.logging(configVal);
    this.sdkConfig = configVal;
    this.setupInterceptors(configVal.retry, configVal.interceptors);
  }

  private setupInterceptors(retry: SDKConfig['retry'], customInterceptors: SDKConfig['interceptors']) {
    this.client.interceptors.request.clear();
    this.client.interceptors.response.clear();

    // NOTE: Retry interceptor - must be setup first
    if (retry) {
      const retryConfig = typeof retry === 'string' ? DEFAULT_RETRY_STRATEGY_OPTIONS[retry] : retry;

      axiosRetry(this.client, {
        retries: retryConfig.maxRetries,
        shouldResetTimeout: true,
        retryCondition: (err) => isNetworkOrIdempotentRequestError(err) || err.response?.status === 429,
        retryDelay: (retryCount) => {
          if (retryConfig.exponential) {
            return axiosRetry.exponentialDelay(retryCount);
          }
          return retryConfig.delay;
        },
      });
    }

    // NOTE: Error interceptor - must be setup after retry but before custom
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

    // NOTE: Custom interceptors - must be setup last
    for (const requestInterceptor of customInterceptors?.request ?? []) {
      const callbacks =
        typeof requestInterceptor === 'function'
          ? ([requestInterceptor] as const)
          : ([requestInterceptor?.success, requestInterceptor?.error] as const);
      this.client.interceptors.request.use(...callbacks);
    }
    for (const responseInterceptor of customInterceptors?.response ?? []) {
      const callbacks =
        typeof responseInterceptor === 'function'
          ? ([responseInterceptor] as const)
          : ([responseInterceptor?.success, responseInterceptor?.error] as const);
      this.client.interceptors.response.use(...callbacks);
    }
  }
}

export { RetryStrategy, RetryOptions };
export * from './interfaces/index.js';
export * from './interfaces/query-params/index.js';
export * from './models/index.js';
