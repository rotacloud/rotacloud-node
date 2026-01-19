import { AxiosInterceptorManager, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

type RequestInterceptor = Parameters<AxiosInterceptorManager<InternalAxiosRequestConfig>['use']>;
type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>['use']>;

export type SDKConfig = (
  | {
      apiKey: string;
      basicAuth?: never;
    }
  | {
      apiKey?: never;
      basicAuth: string;
    }
) & {
  stripeKey?: string;
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
};
