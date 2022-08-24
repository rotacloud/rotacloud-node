import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { RotaCloud } from '../rotacloud.js';
import { Version } from '../version.js';

export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;

export enum RetryType {
  EXPO = 'expo',
  STATIC = 'static',
}

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
  public isLeaveRequest(endpoint?: string): boolean {
    return endpoint === '/leave_requests';
  }

  private buildQueryStr(queryParams: Record<string, ParameterValue>) {
    const reducedParams = Object.entries(queryParams).reduce((params, [key, val]) => {
      if (val !== undefined && val !== '') {
        if (Array.isArray(val)) params.push(...val.map((item) => [`${key}[]`, String(item)]));
        else params.push([key, String(val)]);
      }
      return params;
    }, [] as string[][]);

    return new URLSearchParams(reducedParams).toString();
  }

  private getPagingObject(res): Partial<PagingObject> {
    const links = res.headers.link.split(',');
    const keyVal = {};

    links.forEach((link) => {
      const exp = link.split(';');
      const key = exp[1].replace(' rel="', '').replace('"', '').trim();
      const value = exp[0].replace('<', '').replace('>', '').trim();
      keyVal[key] = value;
    });
    return keyVal;
  }

  public async fetch<T = ApiResponse>(httpOptions: AxiosRequestConfig, options?: Options): Promise<AxiosResponse<T>> {
    const DEFAULT_RETRIES = 3;
    const headers: AxiosRequestHeaders = {
      Authorization: `Bearer ${RotaCloud.config.apiKey}`,
      'SDK-Version': Version.version,
    };
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
      paramsSerializer: (params) => {
        return params ? this.buildQueryStr(params) : '';
      },
    };

    if (RotaCloud.config.retryPolicy) {
      axiosRetry(axios, {
        retries: RotaCloud.config.maxRetries || DEFAULT_RETRIES,
        retryDelay: (retryCount) => {
          if (RotaCloud.config.retryType === RetryType.EXPO) {
            return axiosRetry.exponentialDelay(retryCount);
          }
          if (RotaCloud.config.retryType === RetryType.STATIC) {
            return retryCount * 2000;
          }
          return retryCount * 1000;
        },
        onRetry: (retryCount) => {
          // console.log(`Retry attempt ${retryCount}`);
        },
      });
    }

    // const response = axios.get<T>('https://httpstat.us/503');
    const response = await axios.request<T>(reqObject);
    return response;
  }

  private async *listFetch<T = ApiResponse>(
    reqObject: AxiosRequestConfig<T[]>,
    options?: Options
  ): AsyncGenerator<AxiosResponse<T[], any>> {
    let running = true;
    do {
      const res = await this.fetch<T[]>(reqObject, options);
      if (res.headers.link) {
        const pagingObject = this.getPagingObject(res);
        if (pagingObject.last) {
          reqObject.url = pagingObject.next;
        } else {
          running = false;
        }
      } else {
        running = false;
      }
      yield res;
    } while (running);
  }

  private async *listResponses<T = ApiResponse>(reqObject, options?: Options) {
    for await (const res of this.listFetch<T>(reqObject, options)) {
      yield* res.data;
    }
  }

  public iterator<T = ApiResponse>(reqObject, options?: Options) {
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
