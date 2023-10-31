import { AxiosResponse } from 'axios';
import { Auth } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class AuthService extends Service {
  private apiPath = '/auth';

  get(options?: { rawResponse: true } & Options): Promise<AxiosResponse<Auth, any>>;
  get(options?: Options): Promise<Auth>;
  get(options?: Options) {
    return super.fetch<Auth>({ url: this.apiPath }, options).then((res) => (options?.rawResponse ? res : res.data));
  }
}
