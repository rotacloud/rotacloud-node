import { AxiosResponse } from 'axios';
import { Pin } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class PinsService extends Service {
  private apiPath = '/pins';

  get(id: string): Promise<Pin>;
  get(id: string, options?: { rawResponse: true } & Options): Promise<AxiosResponse<Pin, any>>;
  get(id: string, options?: Options): Promise<Pin>;
  get(id: string, options?: Options) {
    return super
      .fetch<Pin>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
