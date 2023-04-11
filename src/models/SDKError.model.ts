export interface SDKErrorParams {
  message?: string;
  code?: number;
  data?: unknown;
}
export class SDKError extends Error {
  readonly code?: number;
  readonly data?: unknown;
  readonly originalError: Error;

  constructor(params: SDKErrorParams) {
    super(params.message);

    this.name = 'SDKError';
    Error.captureStackTrace?.(this, SDKError);
    this.data = params.data;
    this.code = params.code;
  }
}
