import { AxiosResponse } from 'axios';
import { ApiDailyRevenue } from '../interfaces/daily-revenue.interface.js';
import { Service, Options } from './index.js';

import { DailyRevenue } from '../models/daily-revenue.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { DailyRevenueQueryParams } from '../interfaces/query-params/daily-revenue-query-params.interface.js';

export class DailyRevenueService extends Service {
  private apiPath = '/daily_revenue';

  async *list(query: DailyRevenueQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiDailyRevenue>({ url: this.apiPath, params: query }, options)) {
      yield new DailyRevenue(res);
    }
  }

  listAll(query: DailyRevenueQueryParams): Promise<DailyRevenue[]>;
  async listAll(query: DailyRevenueQueryParams) {
    try {
      const attendance = [] as DailyRevenue[];
      for await (const atten of this.list(query)) {
        attendance.push(atten);
      }
      return attendance;
    } catch (err) {
      return err;
    }
  }

  listByPage(query: DailyRevenueQueryParams, options?: Options) {
    return super.iterator<ApiDailyRevenue>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiDailyRevenue>): Promise<DailyRevenue>;
  update(
    id: number,
    data: Partial<ApiDailyRevenue>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiDailyRevenue, any>>;
  update(id: number, data: Partial<ApiDailyRevenue>, options: Options): Promise<DailyRevenue>;
  update(id: number, data: Partial<ApiDailyRevenue>, options?: Options) {
    return super
      .fetch<ApiDailyRevenue>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new DailyRevenue(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }
}
