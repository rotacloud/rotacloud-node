import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { RotaCloud } from '../rotacloud.js';
import { Version } from '../version.js';
import { SDKErrorParams, SDKError } from '../models/SDKError.model.js';

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

export interface Options {
  rawResponse?: boolean;
  expand?: string[];
  fields?: string[];
  limit?: number;
}

interface PagingObject {
  first: string;
  prev: string;
  next: string;
  last: string;
}

type ParameterPrimitive = string | boolean | number | null;
type ParameterValue = ParameterPrimitive | ParameterPrimitive[] | undefined;

export abstract class Service<ApiResponse = any> {
  protected client: AxiosInstance = this.initialiseAxios();

  private initialiseAxios(): AxiosInstance {
    const client = axios.create();
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        let newError = error;
        if (error.isAxiosError) {
          const axiosResponse = error.response;
          const sdkErrorParams: SDKErrorParams = {
            code: axiosResponse.status,
            message: axiosResponse.data?.error,
            data: axiosResponse.data,
          };
          newError = new SDKError(sdkErrorParams);
        }
        return Promise.reject(newError);
      }
    );
    return client;
  }

  public isLeaveRequest(endpoint?: string): boolean {
    return endpoint === '/leave_requests';
  }

  private buildQueryStr(queryParams: Record<string, ParameterValue> | undefined) {
    if (!queryParams) return '';
    const reducedParams = Object.entries(queryParams).reduce((params, [key, val]) => {
      if (val !== undefined && val !== '') {
        if (Array.isArray(val)) params.push(...val.map((item) => [`${key}[]`, String(item)]));
        else params.push([key, String(val)]);
      }
      return params;
    }, [] as string[][]);

    return new URLSearchParams(reducedParams).toString();
  }

  private parsePageLinkHeader(linkHeader: string): Partial<PagingObject> {
    const pageData = {};
    for (const link of linkHeader.split(',')) {
      const { rel, url } = link.match(/<(?<url>.*)>; rel="(?<rel>\w*)"/)?.groups ?? {};
      pageData[rel] = url;
    }

    return pageData;
  }

  public fetch<T = ApiResponse>(httpOptions: AxiosRequestConfig, options?: Options): Promise<AxiosResponse<T>> {
    const headers: AxiosRequestHeaders = {
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
      this.isLeaveRequest(httpOptions.url) ? (headers.User = `${httpOptions.data.user}`) : undefined;
    }

    const reqObject: AxiosRequestConfig<T> = {
      ...httpOptions,
      baseURL: RotaCloud.config.baseUri,
      headers,
      params: {
        expand: options?.expand,
        fields: options?.fields,
        limit: options?.limit,
        ...httpOptions?.params,
      },
      paramsSerializer: this.buildQueryStr,
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

    return this.client.request<T>(reqObject);
  }

  private async *listFetch<T = ApiResponse>(
    reqObject: AxiosRequestConfig<T[]>,
    options?: Options
  ): AsyncGenerator<AxiosResponse<T[], any>> {
    let pageRequestObject = reqObject;
    let currentPageUrl = pageRequestObject.url;

    let pageRemaining = true;
    while (pageRemaining) {
      const res = await this.fetch<T[]>(pageRequestObject, options);
      console.log('this shouldnt happen', currentPageUrl);
      const pageLinkMap = this.parsePageLinkHeader(res.headers.link ?? '');
      pageRemaining = Boolean(pageLinkMap.next);
      // NOTE: query params including paging options are included in the "next" link
      pageRequestObject = { url: pageLinkMap.next };
      yield res;

      // Failsafe incase the page does not change
      if (currentPageUrl === pageRequestObject.url) {
        throw new Error('Next page link did not change');
      }
      currentPageUrl = pageRequestObject.url;
    }
  }

  private async *listResponses<T = ApiResponse>(reqObject: AxiosRequestConfig<T[]>, options?: Options) {
    for await (const res of this.listFetch<T>(reqObject, options)) {
      yield* res.data;
    }
  }

  public iterator<T = ApiResponse>(reqObject: AxiosRequestConfig<T[]>, options?: Options) {
    const iterator = this.listResponses<T>(reqObject, options);
    return {
      [Symbol.asyncIterator]() {
        return {
          next() {
            return iterator.next();
          },
        };
      },
      byPage: () => {
        return this.listFetch<T>(reqObject, options);
      },
    };
  }
}
