import { AxiosResponse } from 'axios';
import { Settings } from '../models/settings.model.js';
import { Service, Options } from './index.js';

import { ApiSettings } from '../interfaces/index.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { SettingsQueryParams } from '../rotacloud.js';

class SettingsService extends Service {
  private apiPath = '/settings';

  get(query: SettingsQueryParams): Promise<Settings>;
  get(query: SettingsQueryParams, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiSettings, any>>;
  get(query: SettingsQueryParams, options: Options): Promise<Settings>;
  get(query: SettingsQueryParams, options?: Options) {
    return super.fetch<ApiSettings>({ url: `${this.apiPath}`, params: query }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Settings(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { SettingsService };
