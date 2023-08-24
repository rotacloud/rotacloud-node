import { AxiosResponse } from 'axios';
import { DailyBudgets } from '../interfaces/daily-budgets.interface.js';
import { Service, Options } from './index.js';

import { DailyBudgetsQueryParams } from '../interfaces/query-params/daily-budgets-query-params.interface.js';

export class DailyBudgetsService extends Service {
  private apiPath = '/daily_budgets';

  async *list(query: DailyBudgetsQueryParams, options?: Options) {
    for await (const res of super.iterator<DailyBudgets>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DailyBudgetsQueryParams, options?: Options): Promise<DailyBudgets[]>;
  async listAll(query: DailyBudgetsQueryParams, options?: Options) {
    const attendance = [] as DailyBudgets[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: DailyBudgetsQueryParams, options?: Options) {
    return super.iterator<DailyBudgets>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(data: Partial<DailyBudgets>[]): Promise<number>;
  update(
    data: Partial<DailyBudgets>[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<DailyBudgets, any>>;
  update(data: Partial<DailyBudgets>[], options: Options): Promise<number>;
  update(data: Partial<DailyBudgets>[], options?: Options) {
    return super
      .fetch<DailyBudgets>({
        url: `${this.apiPath}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
