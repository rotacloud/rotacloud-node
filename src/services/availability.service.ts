import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { AvailabilityQueryParams } from '../interfaces/query-params/availability-query-params.interface.js';
import { Availability } from '../interfaces/availability.interface.js';

export class AvailabilityService extends Service<Availability> {
  private apiPath = '/availability';

  update(data: Availability): Promise<Availability>;
  update(data: Availability, options: { rawResponse: true } & Options): Promise<AxiosResponse<Availability>>;
  update(data: Availability, options?: Options): Promise<Availability | AxiosResponse<Availability>>;
  update(data: Availability, options?: Options) {
    return super
      .fetch<Availability>(
        {
          url: this.apiPath,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  /** Alias of {@link AvailabilityService["update"]} */
  create(data: Availability): Promise<Availability>;
  create(data: Availability, options: { rawResponse: true } & Options): Promise<AxiosResponse<Availability>>;
  create(data: Availability, options?: Options): Promise<Availability | AxiosResponse<Availability>>;
  create(data: Availability, options?: Options) {
    return this.update(data, options);
  }

  delete(user: number, dates: string[]): Promise<Availability>;
  delete(user: number, dates: string[], options: { rawResponse: true } & Options): Promise<AxiosResponse<Availability>>;
  delete(user: number, dates: string[], options?: Options): Promise<Availability | AxiosResponse<Availability>>;
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

  async *list(query?: AvailabilityQueryParams, options?: Options) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listByPage(query?: AvailabilityQueryParams, options?: Options) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }
}
