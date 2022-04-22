import { AxiosResponse } from 'axios';
import { ApiDaysOff } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { ErrorResponse } from '../models/error-response.model.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';
import { DaysOff } from '../models/days-off.model.js';
import { DaysOffQueryParams } from '../interfaces/query-params/days-off-query-params.interface.js';

class DaysOffService extends Service<ApiDaysOff> {
  private apiPath = '/days_off';

  create(dates: string[], users: number[]): Promise<number>;
  create(
    dates: string[],
    users: number[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiDaysOff, any>>;
  create(dates: string[], users: number[], options: Options<InternalQueryParams>): Promise<number>;
  create(dates: string[], users: number[], options?: Options<InternalQueryParams>) {
    return super
      .fetch({
        url: this.apiPath,
        data: {
          dates,
          users,
        },
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : res.status),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  async *list(options?: Options<DaysOffQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator({ url: this.apiPath }, options)) {
      yield new DaysOff(res);
    }
  }

  listByPage(options?: Options<DaysOffQueryParams & InternalQueryParams>) {
    return super.iterator({ url: this.apiPath }, options).byPage();
  }

  delete(dates: string[], users: number[]): Promise<number>;
  delete(
    dates: string[],
    users: number[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<any, any>>;
  delete(dates: string[], users: number[], options: Options<InternalQueryParams>): Promise<number>;
  delete(dates: string[], users: number[], options?: Options<InternalQueryParams>) {
    return super
      .fetch({
        url: this.apiPath,
        method: 'DELETE',
        data: {
          dates,
          users,
        },
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : res.status),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }
}

export { DaysOffService };
