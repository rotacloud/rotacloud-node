export interface SDKErrorConfig {
  message?: string;
  code?: number;
  data?: unknown;
}
export class SDKError extends Error {
  readonly code?: number;
  readonly data?: unknown;
  override name = this.constructor.name;

  constructor(errorConfig: SDKErrorConfig) {
    super(errorConfig.message);

    Error.captureStackTrace?.(this, SDKError);
    // optional chaining needed as is v8 specific https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#static_methods

    this.data = errorConfig.data;
    this.code = errorConfig.code;
  }
}
