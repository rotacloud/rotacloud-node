import { AxiosResponse } from 'axios';
import { DailyRevenue } from '../interfaces/daily-revenue.interface.js';
import { Service, Options } from './index.js';

import { DailyRevenueQueryParams } from '../interfaces/query-params/daily-revenue-query-params.interface.js';

export class DailyRevenueService extends Service {
  private apiPath = '/daily_revenue';

  async *list(query: DailyRevenueQueryParams, options?: Options) {
    for await (const res of super.iterator<DailyRevenue>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DailyRevenueQueryParams, options?: Options): Promise<DailyRevenue[]>;
  async listAll(query: DailyRevenueQueryParams, options?: Options) {
    const attendance = [] as DailyRevenue[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: DailyRevenueQueryParams, options?: Options) {
    return super.iterator<DailyRevenue>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(data: Partial<DailyRevenue>[]): Promise<number>;
  update(
    data: Partial<DailyRevenue>[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<DailyRevenue, any>>;
  update(data: Partial<DailyRevenue>[], options: Options): Promise<number>;
  update(data: Partial<DailyRevenue>[], options?: Options) {
    return super
      .fetch<DailyRevenue>({
        url: `${this.apiPath}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
