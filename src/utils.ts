import axios, { Axios, AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import assert from 'assert';
import { RetryOptions, RetryStrategy, SDKConfig } from './interfaces/index.js';
import { SDKError } from './models/index.js';
import { version } from '../package.json' assert { type: 'json' };

/** Creates a `Partial<T>` where all properties specified by `K` are required
 *
 * e.g.
 * `RequirementsOf<{id: number, user: number, location: number}, "id" | "user">` is
 * equivalent to `{id: number, user: number, location?: number}`
 * */
export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;


/** Supported primitive/atomic types for query parameters */
type QueryParameterPrimitive = string | boolean | number | null | symbol;
/** Supported types for query parameters */
export type QueryParameterValue = QueryParameterPrimitive | QueryParameterPrimitive[] | undefined;

/** SDK specific options for configuring a request */
export interface RequestOptions<T> {
  /** Client side option to determine whether to return the entire response
   * including metadata such as status code and headers */
  rawResponse?: boolean;
  /** The maximum number of entities to return
   *
   * Once the limit is reached, paginated requests will stop automatically */
  maxResults?: number;
  /* Prevent the API from committing to a desired action */
  dryRun?: boolean;
  /* Specify which fields should be returned for an entity */
  fields?: T extends Object ? (keyof T)[] : never;
}

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

/** Converts a map of query parameter key/values into API compatible {@see URLSearchParams} */
function toSearchParams(parameters?: Record<string, QueryParameterValue>): URLSearchParams {
  const queryParams: Record<string, QueryParameterValue> = { ...parameters };
  const reducedParams = Object.entries(queryParams ?? {}).reduce((params, [key, val]) => {
    if (val !== undefined && val !== '') {
      if (Array.isArray(val)) params.push(...val.map((item) => [`${key}[]`, String(item)]));
      else params.push([key, String(val)]);
    }
    return params;
  }, [] as string[][]);

  return new URLSearchParams(reducedParams);
}

/** Creates and configures an Axios client for use in all calls to API endpoints
 * according to the provided {@see SDKConfig}
 */
export function createCustomAxiosClient(config?: SDKConfig): Axios {
  const baseURL = URL.parse(config?.baseUri ?? '')?.toString();
  assert(baseURL !== null, 'Must have a valid base URL');
  const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => toSearchParams({ ...params, exclude_link_header: true }).toString(),
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

/** Utility for getting a basic {@see AxiosRequestConfig} for a given request ready
 * for an {@see OpFunction} to adapt/use
 */
export function getBaseRequestConfig(opts: SDKConfig): AxiosRequestConfig<unknown> {
  const headers: Record<string, string> = {
    Authorization: opts.apiKey ? `Bearer ${opts.apiKey}` : `Basic ${opts.basicAuth}`,
    'SDK-Version': version,
  };

  const extraHeaders = opts.headers;
  if (extraHeaders && typeof extraHeaders === 'object') {
    for (const [key, val] of Object.entries(extraHeaders)) {
      headers[key] = String(val);
    }
  }
  if (opts.accountId) {
    headers.Account = String(opts.accountId);
  }

  return {
    headers,
  };
}
