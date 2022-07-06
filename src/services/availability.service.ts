import { Service, Options, RequirementsOf } from './index.js';

import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';
import { AvailabilityQueryParams } from '../interfaces/query-params/availability-query-params.interface.js';
import { Availability } from '../models/availability.model.js';
import { ApiAvailability } from '../interfaces/availability.interface.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { AxiosResponse } from 'axios';

type RequiredProps = 'start' | 'end';
type RequiredOptions<T> = RequirementsOf<Options<T>, 'params'>;

export class AvailabilityService extends Service {
  private apiPath = '/availability';

  update(data: ApiAvailability): Promise<Availability>;
  update(
    data: ApiAvailability,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAvailability>>;
  update(
    data: ApiAvailability,
    options?: Options<InternalQueryParams>
  ): Promise<Availability | AxiosResponse<ApiAvailability>>;
  update(data: ApiAvailability, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiAvailability>({
        url: this.apiPath,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Availability(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  /** Alias of {@link AvailabilityService["update"]} */
  create(data: ApiAvailability): Promise<Availability>;
  create(
    data: ApiAvailability,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAvailability>>;
  create(
    data: ApiAvailability,
    options?: Options<InternalQueryParams>
  ): Promise<Availability | AxiosResponse<ApiAvailability>>;
  create(data: ApiAvailability, options?: Options<InternalQueryParams>) {
    return this.update(data, options);
  }

  delete(user: number, dates: string[]): Promise<Availability>;
  delete(
    user: number,
    dates: string[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAvailability>>;
  delete(
    user: number,
    dates: string[],
    options?: Options<InternalQueryParams>
  ): Promise<Availability | AxiosResponse<ApiAvailability>>;
  delete(user: number, dates: string[], options?: Options<InternalQueryParams>) {
    return this.update(
      {
        user,
        dates: dates.map((date) => {
          return {
            date,
            available: [],
            unavailable: [],
          };
        }),
      },
      options
    );
  }

  async *list(options: RequiredOptions<RequirementsOf<AvailabilityQueryParams, RequiredProps> & InternalQueryParams>) {
    for await (const res of super.iterator<ApiAvailability>({ url: this.apiPath }, options)) {
      yield new Availability(res);
    }
  }

  listByPage(options: RequiredOptions<RequirementsOf<AvailabilityQueryParams, RequiredProps> & InternalQueryParams>) {
    return super.iterator<ApiAvailability>({ url: this.apiPath }, options).byPage();
  }
}
