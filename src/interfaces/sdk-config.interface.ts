import { RetryOptions, RetryStrategy } from '../services/service.js';

export interface SDKConfig {
  baseUri?: string;
  apiKey: string;
  accountId?: number;
  userId?: number;
  retry?: false | `${RetryStrategy}` | RetryOptions;
  [key: string]: unknown;
}
