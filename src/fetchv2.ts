import axios, { Axios, AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import { RetryOptions, RetryStrategy, SDKConfig } from './interfaces';
import { SDKError } from './models';
import { Version } from './version';
import { OptionsExtended } from './services/service';

type ParameterPrimitive = string | boolean | number | null | symbol;
type ParameterValue = ParameterPrimitive | ParameterPrimitive[] | undefined;

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

function parseClientError(error: AxiosError): SDKError {
  const axiosErrorLocation = error.response || error.request;
  const apiErrorMessage = axiosErrorLocation.data?.error;
  return new SDKError({
    code: axiosErrorLocation.status,
    message: apiErrorMessage || error.message,
    data: axiosErrorLocation.data,
  });
}

function buildQueryParams<T = unknown>(options?: OptionsExtended<T>, extraParams?: Record<string, ParameterValue>) {
  const queryParams: Record<string, ParameterValue> = {
    fields: options?.fields,
    limit: options?.limit,
    offset: options?.offset,
    dry_run: options?.dryRun,
    ...extraParams,
    // NOTE: Should not overridable so must come after spread of params
    exclude_link_header: true,
  };
  const reducedParams = Object.entries(queryParams ?? {}).reduce((params, [key, val]) => {
    if (val !== undefined && val !== '') {
      if (Array.isArray(val)) params.push(...val.map((item) => [`${key}[]`, String(item)]));
      else params.push([key, String(val)]);
    }
    return params;
  }, [] as string[][]);

  return new URLSearchParams(reducedParams);
}

export function createCustomAxiosClient(config?: SDKConfig): Axios {
  const axiosClient = axios.create({
    // TODO: sanitise base URI
    baseURL: config?.baseUri,
    // TODO: inline this?
    paramsSerializer: (params) => buildQueryParams(params).toString(),
  });

  axiosClient.interceptors.request.clear();
  axiosClient.interceptors.response.clear();

  // NOTE: Retry interceptor - must be setup first
  if (config?.retry) {
    const retryConfig = typeof config.retry === 'string' ? DEFAULT_RETRY_STRATEGY_OPTIONS[config.retry] : config.retry;

    axiosRetry(axiosClient, {
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
  axiosClient.interceptors.response.use(
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
  for (const requestInterceptor of config?.interceptors?.request ?? []) {
    const callbacks =
      typeof requestInterceptor === 'function'
        ? ([requestInterceptor] as const)
        : ([requestInterceptor?.success, requestInterceptor?.error] as const);
    axiosClient.interceptors.request.use(...callbacks);
  }
  for (const responseInterceptor of config?.interceptors?.response ?? []) {
    const callbacks =
      typeof responseInterceptor === 'function'
        ? ([responseInterceptor] as const)
        : ([responseInterceptor?.success, responseInterceptor?.error] as const);
    axiosClient.interceptors.response.use(...callbacks);
  }

  return axiosClient;
}

export function getBaseRequestConfig(opts: SDKConfig): AxiosRequestConfig<unknown> {
  const headers: Record<string, string> = {
    Authorization: opts.apiKey ? `Bearer ${opts.apiKey}` : `Basic ${opts.basicAuth}`,
    'SDK-Version': Version.version,
  };

  const extraHeaders = opts.headers;
  if (extraHeaders && typeof extraHeaders === 'object') {
    for (const [key, val] of Object.entries(extraHeaders)) {
      if (typeof key === 'string' && typeof val === 'string') {
        headers[key] = val;
      }
    }
  }
  if (opts.accountId) {
    headers.Account = String(opts.accountId);
  } else {
    // need to convert user field in payload to a header for creating leave_requests when using an API key
    // this.isLeaveRequest(reqConfig.url) ? (headers.User = `${reqConfig.data.user}`) : undefined;
  }

  return {
    headers,
  };
}
