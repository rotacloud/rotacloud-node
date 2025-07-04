import axios, { Axios, AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';
import { RetryOptions, RetryStrategy, SDKConfig } from './interfaces/index.js';
import { SDKError } from './error.js';
import pkg from '../package.json' with { type: 'json' };

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

class AssertionError extends Error {
  override name = AssertionError.prototype.name;
}

/** Ensures the provided value resolves to `true` before continuing
 *
 * If the value doesn't resolve to `true` then the provided `error` will be thrown
 *
 * Intended to be run in production and not removed on build
 *
 * @param assertion assertion to verify
 * @param error error to throw. If `undefined` or a `string` then an {@link AssertionError}
 * will be thrown instead
 */
export function assert(assertion: unknown, error?: string | Error): asserts assertion {
  if (assertion) return;
  if (error === undefined || typeof error === 'string')
    throw new AssertionError(error ?? `Assertion failed - value = ${assertion}`);
  throw error;
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

function parseClientError(error: AxiosError): SDKError {
  const axiosErrorLocation = error.response || error.request;
  const apiErrorMessage = axiosErrorLocation.data?.message ?? axiosErrorLocation.data?.error;
  let url: URL | undefined;
  try {
    url = new URL(error.config?.url ?? '', error.config?.baseURL);
    for (const [key, value] of toSearchParams(error.config?.params)) {
      url.searchParams.set(key, value);
    }
  } catch (err) {
    url = undefined;
  }
  return new SDKError({
    url: url?.toString(),
    code: axiosErrorLocation.status,
    message: apiErrorMessage || error.message,
    data: axiosErrorLocation.data,
  });
}

/** Creates and configures an Axios client for use in all calls to API endpoints
 * according to the provided {@see SDKConfig}
 */
export function createCustomAxiosClient(config: Readonly<SDKConfig>): Axios {
  let baseURL: string | undefined;
  try {
    baseURL = new URL(config?.baseUri ?? '').toString();
  } catch {
    baseURL = undefined;
  }
  assert(baseURL !== undefined, `Must have a valid base URL. Got: ${config.baseUri}`);
  const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => toSearchParams({ ...params, exclude_link_header: true }).toString(),
  });

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
  const headers: Record<string, string> = {};

  const extraHeaders = opts.headers;
  if (extraHeaders && typeof extraHeaders === 'object') {
    for (const [key, val] of Object.entries(extraHeaders)) {
      headers[key] = String(val);
    }
  }
  if (opts.accountId) {
    headers.Account = String(opts.accountId);
  }

  // Set last to prevent being overridden
  headers.Authorization = opts.apiKey ? `Bearer ${opts.apiKey}` : `Basic ${opts.basicAuth}`;
  headers['SDK-Version'] = pkg.version;

  return {
    headers,
  };
}

/** Defaults all undefined properties in a given object with the value specified
 * in the provided {@see defaultObj} parameter
 *
 * This returns a new object and does not modify {@see obj}
 */
export function defaultObject<T extends object>(obj: Readonly<T>, defaultObj: Readonly<Partial<T>>): T {
  const defaulted = { ...obj };
  for (const [key, value] of Object.entries(defaultObj)) {
    defaulted[key] ??= value;
  }
  return defaulted;
}
