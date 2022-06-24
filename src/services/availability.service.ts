import { Service, Options, RequirementsOf } from './index.js';

import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';
import { AvailabilityQueryParams } from '../interfaces/query-params/availability-query-params.interface.js';
import { Availability } from '../models/availability.model.js';
import { ApiAvailability } from '../interfaces/availability.interface.js';

type RequiredProps = 'start' | 'end';
type RequiredOptions<T> = RequirementsOf<Options<T>, 'params'>;

export class AvailabilityService extends Service {
  private apiPath = '/availability';

  async *list(options: RequiredOptions<RequirementsOf<AvailabilityQueryParams, RequiredProps> & InternalQueryParams>) {
    for await (const res of super.iterator<ApiAvailability>({ url: this.apiPath }, options)) {
      yield new Availability(res);
    }
  }

  listByPage(options: RequiredOptions<RequirementsOf<AvailabilityQueryParams, RequiredProps> & InternalQueryParams>) {
    return super.iterator<ApiAvailability>({ url: this.apiPath }, options).byPage();
  }
}
