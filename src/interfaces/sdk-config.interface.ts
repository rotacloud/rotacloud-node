import { AxiosInterceptorManager, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RetryOptions, RetryStrategy } from '../services/service.js';

type RequestInterceptor = Parameters<AxiosInterceptorManager<InternalAxiosRequestConfig>['use']>;
type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>['use']>;

export interface SDKBase {
  baseUri?: string;
  accountId?: number;
  userId?: number;
  retry?: false | `${RetryStrategy}` | RetryOptions;
  interceptors?: {
    request?: (
      | RequestInterceptor[0]
      | {
          success?: RequestInterceptor[0];
          error?: RequestInterceptor[1];
        }
    )[];
    response?: (
      | ResponseInterceptor[0]
      | {
          success?: ResponseInterceptor[0];
          error?: ResponseInterceptor[1];
        }
    )[];
  };
  [key: string]: unknown;
}

export interface SDKBearerAuth extends SDKBase {
  apiKey: string;
  basicAuth?: never;
}

export interface SDKBasicAuth extends SDKBase {
  apiKey?: never;
  basicAuth: string;
}

export type SDKConfig = SDKBasicAuth | SDKBearerAuth;
