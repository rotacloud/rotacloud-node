import { createSdkClient, SdkClient } from './client-builder.js';
import type { SDKConfig } from './interfaces/sdk-config.interface.js';
import { SERVICES } from './service.js';

export * from './interfaces/index.js';
export * from './interfaces/query-params/index.js';
export * from './error.js';
export type { RequestOptions } from './utils.js';
/** The client for all public RotaCloud SDK services. */
export type RotaCloudClient = SdkClient<typeof SERVICES>;

export const createRotaCloudClient: (config: SDKConfig) => RotaCloudClient = createSdkClient(SERVICES);
