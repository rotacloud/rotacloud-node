import { RetryType } from '../services/service.js';

export interface SDKConfig {
  baseUri?: string;
  apiKey: string;
  accountId?: number;
  userId?: number;
  retryPolicy?: true;
  retryType?: RetryType | string;
  maxRetries?: number;
}
