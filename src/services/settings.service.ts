import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { ApiSettings } from '../interfaces/index.js';

import { SettingsQueryParams } from '../rotacloud.js';

export class SettingsService extends Service {
  private apiPath = '/settings';

  get(query: SettingsQueryParams): Promise<ApiSettings>;
  get(query: SettingsQueryParams, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiSettings, any>>;
  get(query: SettingsQueryParams, options: Options): Promise<ApiSettings>;
  get(query: SettingsQueryParams, options?: Options) {
    return super
      .fetch<ApiSettings>({ url: `${this.apiPath}`, params: query }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
