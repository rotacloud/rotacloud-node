export class SDKError extends Error {
  override name = 'SDKError';
  /** HTTP status code of the error */
  readonly code?: number;
  /** Data returned by the API in the event of an error */
  readonly data?: unknown;
  /** URL that triggered the error */
  readonly url?: string;

  constructor(errorConfig: { message?: string; code?: number; data?: unknown; url?: string }) {
    super(errorConfig.message);

    // optional chaining needed as is v8 specific https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#static_methods
    Error.captureStackTrace?.(this, SDKError);

    this.code = errorConfig.code;
    this.url = errorConfig.url;
    this.data = errorConfig.data;
  }
}
