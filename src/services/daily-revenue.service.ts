import { AxiosResponse } from 'axios';
import { DailyRevenue } from '../interfaces/daily-revenue.interface.js';
import { Service, Options, OptionsExtended } from './index.js';

import { DailyRevenueQueryParams } from '../interfaces/query-params/daily-revenue-query-params.interface.js';

export class DailyRevenueService extends Service<DailyRevenue> {
  private apiPath = '/daily_revenue';

  list(query: DailyRevenueQueryParams): AsyncGenerator<DailyRevenue>;
  list<F extends keyof DailyRevenue>(
    query: DailyRevenueQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyRevenue>,
  ): AsyncGenerator<Pick<DailyRevenue, F>>;
  list(query: DailyRevenueQueryParams, options?: OptionsExtended<DailyRevenue>): AsyncGenerator<DailyRevenue>;
  async *list(query: DailyRevenueQueryParams, options?: OptionsExtended<DailyRevenue>) {
    yield* super.iterator<DailyRevenue>({ url: this.apiPath, params: query }, options);
  }

  listAll(query: DailyRevenueQueryParams): Promise<DailyRevenue[]>;
  listAll<F extends keyof DailyRevenue>(
    query: DailyRevenueQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyRevenue>,
  ): Promise<Pick<DailyRevenue, F>[]>;
  listAll(query: DailyRevenueQueryParams, options?: OptionsExtended<DailyRevenue>): Promise<DailyRevenue[]>;
  async listAll(query: DailyRevenueQueryParams, options?: OptionsExtended<DailyRevenue>) {
    const attendance = [] as DailyRevenue[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: DailyRevenueQueryParams): AsyncGenerator<AxiosResponse<DailyRevenue[]>>;
  listByPage<F extends keyof DailyRevenue>(
    query: DailyRevenueQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyRevenue>,
  ): AsyncGenerator<AxiosResponse<Pick<DailyRevenue, F>[]>>;
  listByPage(
    query: DailyRevenueQueryParams,
    options?: OptionsExtended<DailyRevenue>,
  ): AsyncGenerator<AxiosResponse<DailyRevenue[]>>;
  listByPage(query: DailyRevenueQueryParams, options?: OptionsExtended<DailyRevenue>) {
    return super.iterator<DailyRevenue>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(data: Partial<DailyRevenue>[]): Promise<number>;
  update(data: Partial<DailyRevenue>[], options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  update(data: Partial<DailyRevenue>[], options: Options): Promise<number>;
  update(data: Partial<DailyRevenue>[], options?: Options) {
    return super
      .fetch<void>(
        {
          url: `${this.apiPath}`,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
