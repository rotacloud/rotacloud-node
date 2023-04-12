export interface SDKErrorParams {
  message?: string;
  code?: number;
  data?: unknown;
}
export class SDKError extends Error {
  readonly code?: number;
  readonly data?: unknown;
  override name = this.constructor.name;

  constructor(params: SDKErrorParams) {
    super(params.message);

    Error.captureStackTrace?.(this, SDKError);
    this.data = params.data;
    this.code = params.code;
  }
}
