import { AxiosResponse } from 'axios';
import { Pin } from '../interfaces/index.js';
import { Service, Options, OptionsExtended } from './index.js';

export class PinsService extends Service<Pin> {
  private apiPath = '/pins';

  get(id: string): Promise<Pin>;
  get<F extends keyof Pin>(
    id: string,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Pin>,
  ): Promise<AxiosResponse<Pick<Pin, F>>>;
  get<F extends keyof Pin>(id: string, options: { fields: F[] } & OptionsExtended<Pin>): Promise<Pick<Pin, F>>;
  get(id: string, options: { rawResponse: true } & Options): Promise<AxiosResponse<Pin>>;
  get(id: string, options?: OptionsExtended<Pin>): Promise<Pin>;
  get(id: string, options?: OptionsExtended<Pin>) {
    return super
      .fetch<Pin>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }
}
