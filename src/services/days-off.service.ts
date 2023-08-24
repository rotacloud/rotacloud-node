import { AxiosResponse } from 'axios';
import { DaysOff } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { DaysOffQueryParams } from '../interfaces/query-params/days-off-query-params.interface.js';

export class DaysOffService extends Service<DaysOff> {
  private apiPath = '/days_off';

  create(dates: string[], users: number[]): Promise<number>;
  create(
    dates: string[],
    users: number[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<DaysOff, any>>;
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
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  async *list(query: DaysOffQueryParams, options?: Options) {
    for await (const res of super.iterator({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DaysOffQueryParams, options?: Options): Promise<DaysOff[]>;
  async listAll(query: DaysOffQueryParams, options?: Options) {
    const daysOff = [] as DaysOff[];
    for await (const dayOff of this.list(query, options)) {
      daysOff.push(dayOff);
    }
    return daysOff;
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
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
