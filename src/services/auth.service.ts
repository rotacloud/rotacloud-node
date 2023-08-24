import { AxiosResponse } from 'axios';
import { ApiAuth } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class AuthService extends Service {
  private apiPath = '/auth';

  get(options?: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAuth, any>>;
  get(options?: Options): Promise<ApiAuth>;
  get(options?: Options) {
    return super
      .fetch<ApiAuth>({ url: this.apiPath }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
