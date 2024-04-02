import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SDKConfig} from '../rotacloud.js';
import {Version} from '../version.js';

export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;

export interface Options {
  rawResponse?: boolean;
  limit?: number;
  offset?: number;
  dryRun?: boolean;
}

export type OptionsExtended<T = unknown> = Options & {
  fields?: (keyof T)[];
};

type ParameterPrimitive = string | boolean | number | null | symbol;
type ParameterValue = ParameterPrimitive | ParameterPrimitive[] | undefined;

export abstract class Service<ApiResponse = any> {
  constructor(
      protected client: AxiosInstance,
      protected readonly options: { config: SDKConfig }
  ) {}

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
      Authorization: this.options.config.apiKey
        ? `Bearer ${this.options.config.apiKey}`
        : `Basic ${this.options.config.basicAuth}`,
      'SDK-Version': Version.version,
    };

    const extraHeaders = this.options.config.headers;
    if (extraHeaders && typeof extraHeaders === 'object') {
      for (const [key, val] of Object.entries(extraHeaders)) {
        if (typeof key === 'string' && typeof val === 'string') {
          headers[key] = val;
        }
      }
    }

    if (this.options.config.accountId) {
      headers.Account = String(this.options.config.accountId);
    } else {
      // need to convert user field in payload to a header for creating leave_requests when using an API key
      this.isLeaveRequest(reqConfig.url) ? (headers.User = `${reqConfig.data.user}`) : undefined;
    }

    const finalReqConfig: AxiosRequestConfig<T> = {
      ...reqConfig,
      baseURL: this.options.config.baseUri,
      headers,
      params: this.buildQueryParams(options, reqConfig.params),
    };

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
