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

export type Options<T = unknown> =
  | {
      rawResponse?: boolean;
      expand?: string[];
      fields?: (keyof T)[];
      limit?: number;
      offset?: number;
      dryRun?: boolean;
    }
  | {
      rawResponse?: boolean;
      expand: string[];
      fields: (keyof T | `${string & keyof T}.${string}`)[];
      limit?: number;
      offset?: number;
      dryRun?: boolean;
    };

export const testOpts: Options<{ prop1: string }> = {
  expand: [],
  fields: ['prop1', 'prop1.val'],
};

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

type ParameterPrimitive = string | boolean | number | null | symbol;
type ParameterValue = ParameterPrimitive | ParameterPrimitive[] | undefined;

export abstract class Service<ApiResponse = any> {
  protected client: AxiosInstance = this.initialiseAxios();

  private initialiseAxios(): AxiosInstance {
    const client = axios.create();
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        const parsedError = this.parseClientError(error);

        return Promise.reject(parsedError);
      },
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

  private buildQueryParams<T = ApiResponse>(options?: Options<T>, extraParams?: Record<string, ParameterValue>) {
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

  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  fetch<T = ApiResponse>(
    reqConfig: AxiosRequestConfig,
    options: { expand: string[] } & Options<T>,
  ): Promise<AxiosResponse<T>>;
  fetch<T = ApiResponse>(
    reqConfig: AxiosRequestConfig,
    options: { expand: undefined; fields: Required<Options<T>>['fields'] } & Options<T>,
  ): Promise<AxiosResponse<Pick<T, (typeof options)['fields'][number]>>>;
  fetch<T extends unknown[] = ApiResponse[], E = T[number]>(
    reqConfig: AxiosRequestConfig,
    options: { expand: string[] } & Options<E>,
  ): Promise<AxiosResponse<E[]>>;
  fetch<T extends unknown[] = ApiResponse[], E = T[number]>(
    reqConfig: AxiosRequestConfig,
    options: { expand: undefined; fields: Required<Options<E>>['fields'] } & Options<E>,
  ): Promise<AxiosResponse<Pick<E, (typeof options)['fields'][number]>[]>>;
  fetch<T extends unknown[] = ApiResponse[], E = T[number]>(
    reqConfig: AxiosRequestConfig,
    options?: Options<E>,
  ): Promise<AxiosResponse<E[]>>;
  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig, options?: Options<T>): Promise<AxiosResponse<T | Partial<T>>>;
  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig, options?: Options<T>) {
    const headers: Record<string, string> = {
      Authorization: RotaCloud.config.apiKey
        ? `Bearer ${RotaCloud.config.apiKey}`
        : `Basic ${RotaCloud.config.basicAuth}`,
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

  /** Iterates through every page for a potentially paginated request */
  private fetchPages<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>): AsyncGenerator<AxiosResponse<T[]>>;
  private fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options: { expand: string[] } & Options<T>,
  ): AsyncGenerator<AxiosResponse<T[]>>;
  private fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options: { expand: undefined; fields: Required<Options<T>>['fields'] } & Options<T>,
  ): AsyncGenerator<AxiosResponse<Pick<T, (typeof options)['fields'][number]>[]>>;
  private fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options?: Options<T>,
  ): AsyncGenerator<AxiosResponse<T[]>>;
  private async *fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options?: Options<T>,
  ): AsyncGenerator<AxiosResponse<T[]>> {
    const fallbackLimit = 20;
    const res = await this.fetch<T[]>(reqConfig, options);
    yield res;

    const limit = Number(res.headers['x-limit']) || fallbackLimit;
    const entityCount = Number(res.headers['x-total-count']) || 0;
    const requestOffset = Number(res.headers['x-offset']) || 0;

    for (let offset = requestOffset + limit; offset < entityCount; offset += limit) {
      yield this.fetch<T[]>(reqConfig, { ...options, offset } as Options<T>);
    }
  }

  private async *listResponses<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options<T>) {
    for await (const res of this.fetchPages<T>(reqConfig, options)) {
      yield* res.data;
    }
  }

  iterator<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options<T>) {
    return {
      [Symbol.asyncIterator]: () => this.listResponses<T>(reqConfig, options),
      byPage: () => this.fetchPages<T>(reqConfig, options),
    };
  }
}
