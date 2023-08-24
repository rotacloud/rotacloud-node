import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { AvailabilityQueryParams } from '../interfaces/query-params/availability-query-params.interface.js';
import { ApiAvailability } from '../interfaces/availability.interface.js';

export class AvailabilityService extends Service {
  private apiPath = '/availability';

  update(data: ApiAvailability): Promise<ApiAvailability>;
  update(data: ApiAvailability, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAvailability>>;
  update(data: ApiAvailability, options?: Options): Promise<ApiAvailability | AxiosResponse<ApiAvailability>>;
  update(data: ApiAvailability, options?: Options) {
    return super
      .fetch<ApiAvailability>({
        url: this.apiPath,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  /** Alias of {@link AvailabilityService["update"]} */
  create(data: ApiAvailability): Promise<ApiAvailability>;
  create(data: ApiAvailability, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAvailability>>;
  create(data: ApiAvailability, options?: Options): Promise<ApiAvailability | AxiosResponse<ApiAvailability>>;
  create(data: ApiAvailability, options?: Options) {
    return this.update(data, options);
  }

  delete(user: number, dates: string[]): Promise<ApiAvailability>;
  delete(
    user: number,
    dates: string[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiAvailability>>;
  delete(user: number, dates: string[], options?: Options): Promise<ApiAvailability | AxiosResponse<ApiAvailability>>;
  delete(user: number, dates: string[], options?: Options) {
    return this.update(
      {
        user,
        dates: dates.map((date) => ({
          date,
          available: [],
          unavailable: [],
        })),
      },
      options,
    );
  }

  async *list(query: AvailabilityQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiAvailability>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listByPage(query: AvailabilityQueryParams, options?: Options) {
    return super.iterator<ApiAvailability>({ url: this.apiPath, params: query }, options).byPage();
  }
}
