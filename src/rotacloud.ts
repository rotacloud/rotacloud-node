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
        retryCondition: (err: AxiosError) => isNetworkOrIdempotentRequestError(err) || err.response?.status === 429,
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
