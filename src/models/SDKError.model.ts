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

    Error.captureStackTrace(this, SDKError);

    this.data = errorConfig.data;
    this.code = errorConfig.code;
  }
}
