import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { Settings } from '../interfaces/index.js';

import { SettingsQueryParams } from '../rotacloud.js';

export class SettingsService extends Service {
  private apiPath = '/settings';

  get(query: SettingsQueryParams): Promise<Settings>;
  get(query: SettingsQueryParams, options: { rawResponse: true } & Options): Promise<AxiosResponse<Settings, any>>;
  get(query: SettingsQueryParams, options: Options): Promise<Settings>;
  get(query: SettingsQueryParams, options?: Options) {
    return super
      .fetch<Settings>({ url: `${this.apiPath}`, params: query }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
