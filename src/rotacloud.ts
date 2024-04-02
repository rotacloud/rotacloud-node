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
    this.config = this.createConfig(config);
    const client = this;
    const options = {
      get config(): SDKConfig {
        return client.config;
      }
    }

    this.accounts = new AccountsService(this.client, options);
    this.attendance = new AttendanceService(this.client, options);
    this.auth = new AuthService(this.client, options);
    this.availability = new AvailabilityService(this.client, options);
    this.dailyBudgets = new DailyBudgetsService(this.client, options);
    this.dailyRevenue = new DailyRevenueService(this.client, options);
    this.dayNotes = new DayNotesService(this.client, options);
    this.daysOff = new DaysOffService(this.client, options);
    this.group = new GroupsService(this.client, options);
    this.leaveEmbargoes = new LeaveEmbargoesService(this.client, options);
    this.leaveRequests = new LeaveRequestService(this.client, options);
    this.leaveTypes = new LeaveTypesService(this.client, options);
    this.leave = new LeaveService(this.client, options);
    this.locations = new LocationsService(this.client, options);
    this.pins = new PinsService(this.client, options);
    this.roles = new RolesService(this.client, options);
    this.settings = new SettingsService(this.client, options);
    this.shifts = new ShiftsService(this.client, options);
    this.terminals = new TerminalsService(this.client, options);
    this.terminalsActive = new TerminalsActiveService(this.client, options);
    this.timeZone = new TimeZoneService(this.client, options);
    this.toilAccruals = new ToilAccrualsService(this.client, options);
    this.toilAllowance = new ToilAllowanceService(this.client, options);
    this.usersClockInService = new UsersClockInService(this.client, options);
    this.users = new UsersService(this.client, options);
  }

  /**
   * Overrides undefined config with the default config without removing getters in the object
   */
  private createConfig(config: SDKConfig): SDKConfig {
    const keys = Object.keys(DEFAULT_CONFIG) as (keyof typeof DEFAULT_CONFIG)[];
    for (const key of keys) {
      config[key] ??= DEFAULT_CONFIG[key];
    }
    return config;
  }

  get config() {
    return this.sdkConfig;
  }

  set config(configVal: SDKConfig) {
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
