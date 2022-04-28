import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { RotaCloud } from '../rotacloud.js';
import { Version } from '../version.js';

export type RequirementsOf<T, K extends keyof T> = Required<Pick<T, K>> & Partial<T>;

export interface Options<T> {
  rawResponse?: boolean;
  params?: T;
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
  // rate limit tracking could be implemented here statically

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

  public async fetch<T = ApiResponse>(httpOptions: AxiosRequestConfig, options?): Promise<AxiosResponse<T>> {
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
      params: options?.params,
      paramsSerializer: (params) => {
        return params ? this.buildQueryStr(params) : '';
      },
    };

    const response = await axios.request<T>(reqObject);
    return response;
  }

  private async *listFetch<T = ApiResponse>(reqObject, options?): AsyncGenerator<AxiosResponse<T[], any>> {
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
      yield await res;
    } while (running);
  }

  private async *listResponses<T = ApiResponse>(reqObject, options?) {
    for await (const res of this.listFetch<T>(reqObject, options)) {
      yield* res.data;
    }
  }

  public iterator<T = ApiResponse>(reqObject, options?) {
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
