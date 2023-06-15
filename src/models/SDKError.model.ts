export interface SDKErrorConfig {
  message?: string;
  code?: number;
  data?: unknown;
}
export class SDKError extends Error {
  override name = 'SDKError';
  readonly code?: number;
  readonly data?: unknown;

  constructor(errorConfig: SDKErrorConfig) {
    super(errorConfig.message);

    Error.captureStackTrace?.(this, SDKError);
    // optional chaining needed as is v8 specific https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#static_methods

    this.data = errorConfig.data;
    this.code = errorConfig.code;
  }
}
