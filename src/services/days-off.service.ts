import { AxiosResponse } from 'axios';
import { DaysOff } from '../interfaces/index.js';
import { Service, Options, OptionsExtended } from './index.js';

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
      .fetch<DaysOff>(
        {
          url: this.apiPath,
          data: {
            dates,
            users,
          },
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.status));
  }

  list(query: DaysOffQueryParams): AsyncGenerator<DaysOff>;
  list<F extends keyof DaysOff>(
    query: DaysOffQueryParams,
    options: { fields: F[] } & OptionsExtended<DaysOff>,
  ): AsyncGenerator<Pick<DaysOff, F>>;
  list(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>): AsyncGenerator<DaysOff>;
  async *list(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>) {
    yield* super.iterator<DaysOff>({ url: this.apiPath, params: query }, options);
  }

  listAll(query: DaysOffQueryParams): Promise<DaysOff[]>;
  listAll<F extends keyof DaysOff>(
    query: DaysOffQueryParams,
    options: { fields: F[] } & OptionsExtended<DaysOff[]>,
  ): Promise<Pick<DaysOff, F>[]>;
  listAll(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>): Promise<DaysOff[]>;
  async listAll(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>) {
    const daysOff = [] as DaysOff[];
    for await (const dayOff of this.list(query, options)) {
      daysOff.push(dayOff);
    }
    return daysOff;
  }

  listByPage(query: DaysOffQueryParams): AsyncGenerator<AxiosResponse<DaysOff[]>>;
  listByPage<F extends keyof DaysOff>(
    query: DaysOffQueryParams,
    options: { fields: F[] } & OptionsExtended<DaysOff[]>,
  ): AsyncGenerator<AxiosResponse<Pick<DaysOff, F>[]>>;
  listByPage(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>): AsyncGenerator<AxiosResponse<DaysOff[]>>;
  listByPage(query: DaysOffQueryParams, options?: OptionsExtended<DaysOff>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  delete(dates: string[], users: number[]): Promise<number>;
  delete(dates: string[], users: number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(dates: string[], users: number[], options: Options): Promise<number>;
  delete(dates: string[], users: number[], options?: Options) {
    return super
      .fetch<void>(
        {
          url: this.apiPath,
          method: 'DELETE',
          data: {
            dates,
            users,
          },
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
