import { AxiosResponse } from 'axios';
import { ApiPin } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class PinsService extends Service {
  private apiPath = '/pins';

  get(id: string): Promise<ApiPin>;
  get(id: string, options?: { rawResponse: true } & Options): Promise<AxiosResponse<ApiPin, any>>;
  get(id: string, options?: Options): Promise<ApiPin>;
  get(id: string, options?: Options) {
    return super
      .fetch<ApiPin>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
