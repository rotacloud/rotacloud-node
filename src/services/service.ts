import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { RotaCloud } from '../rotacloud.js';
import { Version } from '../version.js';
import { SDKErrorConfig, SDKError } from '../models/SDKError.model.js';

export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;

export enum RetryStrategy {
  Exponential = 'expo',
  Static = 'static',
}

export type RetryOptions =
  | {
      /** Use exponential back-off */
      exponential?: false;
      /** The maximum number of retries before erroring */
      maxRetries: number;
      /** Delay in milliseconds between retry attempts - not used in exponential back-off */
      delay: number;
    }
  | {
      /** Use exponential back-off */
      exponential: true;
      /** The maximum number of retries before erroring */
      maxRetries: number;
    };

export interface Options {
  rawResponse?: boolean;
  expand?: string[];
  fields?: string[];
  limit?: number;
  offset?: number;
  dryRun?: boolean;
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

const PERSISTENT_PARAMS = new Set(['expand', 'fields', 'limit', 'offset', 'dry_run', 'exclude_link_header']);

type ParameterPrimitive = string | boolean | number | null;
type ParameterValue = ParameterPrimitive | ParameterPrimitive[] | undefined;

function* enumerate<T>(iter: Iterable<T>): Generator<[index: number, item: T]> {
  let idx = 0;
  for (const item of iter) {
    yield [idx, item];
    idx += 1;
  }
}

/** Iterates through all {@see AsyncIterator}s in turn such that all iterators
 * that aren't marked as "done" must return a value before they can return another.
 */
async function* asyncIterInTurn<T>(iters: Iterable<AsyncIterator<T>>): AsyncGenerator<T> {
  const remaining = [...iters];
  while (remaining.length > 0) {
    for (const [idx, iter] of enumerate(remaining)) {
      const { done, value } = await iter.next();
      if (done) {
        remaining.splice(idx, 1);
        break;
      }

      yield value;
    }
  }
}

export abstract class Service<ApiResponse = any> {
  protected client: AxiosInstance = this.initialiseAxios();

  private initialiseAxios(): AxiosInstance {
    const client = axios.create();
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        const parsedError = this.parseClientError(error);

        return Promise.reject(parsedError);
      }
    );
    return client;
  }

  private parseClientError(error: unknown | AxiosError): SDKError | unknown {
    if (!axios.isAxiosError(error)) return error;
    const axiosErrorLocation = error.response || error.request;
    const apiErrorMessage = axiosErrorLocation.data?.error;
    const sdkErrorParams: SDKErrorConfig = {
      code: axiosErrorLocation.status,
      message: apiErrorMessage || error.message,
      data: axiosErrorLocation.data,
    };

    return new SDKError(sdkErrorParams);
  }

  private isLeaveRequest(endpoint?: string): boolean {
    return endpoint === '/leave_requests';
  }

  private buildQueryParams(options?: Options, extraParams?: Record<string, ParameterValue>) {
    const queryParams: Record<string, ParameterValue> = {
      expand: options?.expand,
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

  /** Batches up query parameters to prevent URLs from becoming too large.
   *
   * Special query params such as 'limit' and 'offset' will be preserved in every batch
   */
  private *batchParams(queryParams: URLSearchParams) {
    const maxParams = 300;
    if (queryParams.size <= maxParams) {
      yield queryParams;
      return;
    }

    const baseParams = new URLSearchParams();
    for (const paramName of PERSISTENT_PARAMS) {
      const paramVal = queryParams.get(paramName);
      if (paramVal) baseParams.append(paramName, paramVal);
    }

    let paramChunk = new URLSearchParams(baseParams);
    for (const [key, value] of queryParams) {
      if (!PERSISTENT_PARAMS.has(key)) paramChunk.append(key, value);
      if (paramChunk.size === maxParams) {
        yield paramChunk;
        paramChunk = new URLSearchParams(baseParams);
      }
    }
    if (paramChunk.size > baseParams.size) yield paramChunk;
  }

  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig, options?: Options): Promise<AxiosResponse<T>> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${RotaCloud.config.apiKey}`,
      'SDK-Version': Version.version,
    };

    const extraHeaders = RotaCloud.config.headers;
    if (extraHeaders && typeof extraHeaders === 'object') {
      for (const [key, val] of Object.entries(extraHeaders)) {
        if (typeof key === 'string' && typeof val === 'string') {
          headers[key] = val;
        }
      }
    }

    if (RotaCloud.config.accountId) {
      headers.Account = String(RotaCloud.config.accountId);
    } else {
      // need to convert user field in payload to a header for creating leave_requests when using an API key
      this.isLeaveRequest(reqConfig.url) ? (headers.User = `${reqConfig.data.user}`) : undefined;
    }

    const finalReqConfig: AxiosRequestConfig<T> = {
      ...reqConfig,
      baseURL: RotaCloud.config.baseUri,
      headers,
      params: this.buildQueryParams(options, reqConfig.params),
    };

    if (RotaCloud.config.retry) {
      const retryConfig =
        typeof RotaCloud.config.retry === 'string'
          ? DEFAULT_RETRY_STRATEGY_OPTIONS[RotaCloud.config.retry]
          : RotaCloud.config.retry;

      axiosRetry(this.client, {
        retries: retryConfig.maxRetries,
        retryDelay: (retryCount) => {
          if (retryConfig.exponential) {
            return axiosRetry.exponentialDelay(retryCount);
          }
          return retryConfig.delay;
        },
      });
    }

    return this.client.request<T>(finalReqConfig);
  }

  /** Splits the request into batches and returns the result for each batch in page order */
  private async *batchFetch<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options?: Options
  ): AsyncGenerator<AxiosResponse<T[]>> {
    const reqParams = this.buildQueryParams(options, reqConfig.params);

    const batchedRequests: AsyncGenerator<AxiosResponse<T[]>>[] = [];
    for (const params of this.batchParams(reqParams)) {
      const batchedReqConfig = {
        ...reqConfig,
        params,
      };
      batchedRequests.push(this.fetchPages(batchedReqConfig, options));
    }

    for await (const res of asyncIterInTurn(batchedRequests)) {
      yield res;
    }
  }

  /** Iterates through every page for a potentially paginated request */
  private async *fetchPages<T>(
    reqConfig: AxiosRequestConfig<T[]>,
    options: Options | undefined
  ): AsyncGenerator<AxiosResponse<T[]>> {
    const res = await this.fetch<T[]>(reqConfig, options);
    yield res;

    const limit = Number(res.headers['x-limit'] ?? 1);
    const entityCount = Number(res.headers['x-total-count'] ?? 0);
    const requestOffset = Number(res.headers['x-offset'] ?? 0);

    for (let offset = requestOffset + limit; offset < entityCount; offset += limit) {
      yield this.fetch<T[]>(reqConfig, { ...options, offset });
    }
  }

  private async *listResponses<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options) {
    for await (const res of this.batchFetch<T>(reqConfig, options)) {
      yield* res.data;
    }
  }

  iterator<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options) {
    return {
      [Symbol.asyncIterator]: () => this.listResponses<T>(reqConfig, options),
      byPage: () => this.batchFetch<T>(reqConfig, options),
    };
  }
}
