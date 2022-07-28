import { AxiosResponse } from 'axios';
import { ApiAuth } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { Auth } from '../models/auth.model.js';
import { ErrorResponse } from '../models/error-response.model.js';

export class AuthService extends Service {
  private apiPath = '/auth';

  get(options?: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAuth, any>>;
  get(options?: Options): Promise<Auth>;
  get(options?: Options) {
    return super.fetch<ApiAuth>({ url: this.apiPath }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Auth(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}
