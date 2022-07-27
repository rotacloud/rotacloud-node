import { AxiosResponse } from 'axios';
import { ApiDaysOff } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { ErrorResponse } from '../models/error-response.model.js';

import { DaysOff } from '../models/days-off.model.js';
import { DaysOffQueryParams } from '../interfaces/query-params/days-off-query-params.interface.js';

export class DaysOffService extends Service<ApiDaysOff> {
  private apiPath = '/days_off';

  create(dates: string[], users: number[]): Promise<number>;
  create(
    dates: string[],
    users: number[],
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiDaysOff, any>>;
  create(dates: string[], users: number[], options: Options): Promise<number>;
  create(dates: string[], users: number[], options?: Options) {
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

  async *list(query: DaysOffQueryParams, options?: Options) {
    for await (const res of super.iterator({ url: this.apiPath, params: query }, options)) {
      yield new DaysOff(res);
    }
  }

  listAll(query: DaysOffQueryParams): Promise<DaysOff[]>;
  async listAll(query: DaysOffQueryParams) {
    try {
      const daysOff = [] as DaysOff[];
      for await (const dayOff of this.list(query)) {
        daysOff.push(dayOff);
      }
      return daysOff;
    } catch (err) {
      return err;
    }
  }

  listByPage(query: DaysOffQueryParams, options?: Options) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  delete(dates: string[], users: number[]): Promise<number>;
  delete(dates: string[], users: number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(dates: string[], users: number[], options: Options): Promise<number>;
  delete(dates: string[], users: number[], options?: Options) {
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
