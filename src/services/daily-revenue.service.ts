import { AxiosResponse } from 'axios';
import { ApiDailyRevenue } from '../interfaces/daily-revenue.interface.js';
import { Service, Options } from './index.js';

import { DailyRevenueQueryParams } from '../interfaces/query-params/daily-revenue-query-params.interface.js';

export class DailyRevenueService extends Service {
  private apiPath = '/daily_revenue';

  async *list(query: DailyRevenueQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiDailyRevenue>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DailyRevenueQueryParams, options?: Options): Promise<ApiDailyRevenue[]>;
  async listAll(query: DailyRevenueQueryParams, options?: Options) {
    const attendance = [] as ApiDailyRevenue[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: DailyRevenueQueryParams, options?: Options) {
    return super.iterator<ApiDailyRevenue>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(data: Partial<ApiDailyRevenue>[]): Promise<number>;
  update(
    data: Partial<ApiDailyRevenue>[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiDailyRevenue, any>>;
  update(data: Partial<ApiDailyRevenue>[], options: Options): Promise<number>;
  update(data: Partial<ApiDailyRevenue>[], options?: Options) {
    return super
      .fetch<ApiDailyRevenue>({
        url: `${this.apiPath}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
