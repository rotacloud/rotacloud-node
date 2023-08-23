import { RetryOptions, RetryStrategy } from '../services/service.js';

export interface SDKBase {
  baseUri?: string;
  accountId?: number;
  userId?: number;
  retry?: false | `${RetryStrategy}` | RetryOptions;
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
