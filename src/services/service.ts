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
  limit?: number;
  offset?: number;
  dryRun?: boolean;
}

export type OptionsExtended<T = unknown> = Options & {
  fields?: (keyof T)[];
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

// declare function get<T>(id: number): Promise<T>;
// /** @deprecated expand is not supported by every endpoint and will be removed in a future release */
// declare function get<T>(
//   id: number,
//   options: {
//     expand: string[];
//     fields: string[];
//     rawResponse: true;
//   } & OptionsExtended<T>,
// ): Promise<AxiosResponse<Partial<T>>>;
// /** @deprecated expand is not supported by every endpoint and will be removed in a future release */
// declare function get<T>(
//   id: number,
//   options: {
//     expand: string[];
//     fields: string[];
//   } & OptionsExtended<T>,
// ): Promise<Partial<T>>;
// /** @deprecated expand is not supported by every endpoint and will be removed in a future release */
// declare function get<T>(
//   id: number,
//   options: {
//     expand: string[];
//     rawResponse: true;
//   } & OptionsExtended<T>,
// ): Promise<AxiosResponse<T>>;
// /** @deprecated expand is not supported by every endpoint and will be removed in a future release */
// declare function get<T>(
//   id: number,
//   options: {
//     expand: string[];
//   } & OptionsExtended<T>,
// ): Promise<T>;
// declare function get<T, F extends keyof T>(
//   id: number,
//   options: { fields: F[]; rawResponse: true } & OptionsExtended<T>,
// ): Promise<AxiosResponse<Pick<T, F>>>;
// declare function get<T, F extends keyof T>(
//   id: number,
//   options: { fields: F[] } & OptionsExtended<T>,
// ): Promise<Pick<T, F>>;
// declare function get<T>(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<T>>;
// declare function get<T>(id: number, options?: OptionsExtended<T>): Promise<T>;
//
// export function getFetch<T, S extends Service<T>>(baseService: S, apiPath: string): typeof get<T> {
//   return function get(id: number, options?: OptionsExtended<T>) {
//     return baseService
//       .fetch<T>({ url: `${apiPath}/${id}` }, options)
//       .then((res) => (options?.rawResponse ? res : res.data));
//   };
// }

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

  private buildQueryParams<T = ApiResponse>(
    options?: OptionsExtended<T>,
    extraParams?: Record<string, ParameterValue>,
  ) {
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

  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  fetch<T = ApiResponse>(
    reqConfig: AxiosRequestConfig,
    options: { fields: Required<OptionsExtended<T>>['fields'] } & OptionsExtended<T>,
  ): Promise<AxiosResponse<Pick<T, (typeof options)['fields'][number]>>>;
  fetch<T extends unknown[] = ApiResponse[], E = T[number]>(
    reqConfig: AxiosRequestConfig,
    options: { fields: Required<OptionsExtended<E>>['fields'] } & OptionsExtended<E>,
  ): Promise<AxiosResponse<Pick<E, (typeof options)['fields'][number]>[]>>;
  fetch<T extends unknown[] = ApiResponse[]>(
    reqConfig: AxiosRequestConfig,
    options?: Options,
  ): Promise<AxiosResponse<T>>;
  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig, options?: Options): Promise<AxiosResponse<T | Partial<T>>>;
  fetch<T = ApiResponse>(reqConfig: AxiosRequestConfig, options?: Options) {
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
  private fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options: { fields: Required<OptionsExtended<T>>['fields'] } & OptionsExtended<T>,
  ): AsyncGenerator<AxiosResponse<Pick<T, (typeof options)['fields'][number]>[]>>;
  private fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options?: Options,
  ): AsyncGenerator<AxiosResponse<T[]>>;
  private async *fetchPages<T = ApiResponse>(
    reqConfig: AxiosRequestConfig<T[]>,
    options?: Options,
  ): AsyncGenerator<AxiosResponse<T[]>> {
    const fallbackLimit = 20;
    const res = await this.fetch<T[]>(reqConfig, options);
    yield res;

    const limit = Number(res.headers['x-limit']) || fallbackLimit;
    const entityCount = Number(res.headers['x-total-count']) || 0;
    const requestOffset = Number(res.headers['x-offset']) || 0;

    for (let offset = requestOffset + limit; offset < entityCount; offset += limit) {
      yield this.fetch<T[]>(reqConfig, { ...options, offset });
    }
  }

  private async *listResponses<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options) {
    for await (const res of this.fetchPages<T>(reqConfig, options)) {
      yield* res.data;
    }
  }

  iterator<T = ApiResponse>(reqConfig: AxiosRequestConfig<T[]>, options?: Options) {
    return {
      [Symbol.asyncIterator]: () => this.listResponses<T>(reqConfig, options),
      byPage: () => this.fetchPages<T>(reqConfig, options),
    };
  }
}
