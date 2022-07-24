import { AxiosResponse } from 'axios';
import { ApiDailyBudgets } from '../interfaces/daily-budgets.interface.js';
import { Service, Options } from './index.js';

import { DailyBudgets } from '../models/daily-budgets.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { DailyBudgetsQueryParams } from '../interfaces/query-params/daily-budgets-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.interface.js';

class DailyBudgetsService extends Service {
  private apiPath = '/daily_budgets';

  async *list(options?: Options<DailyBudgetsQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiDailyBudgets>({ url: this.apiPath }, options)) {
      yield new DailyBudgets(res);
    }
  }

  listAll(): Promise<DailyBudgets[]>;
  async listAll() {
    try {
      const attendance = [] as DailyBudgets[];
      for await (const atten of this.list()) {
        attendance.push(atten);
      }
      return attendance;
    } catch (err) {
      return err;
    }
  }

  listByPage(options?: Options<DailyBudgetsQueryParams & InternalQueryParams>) {
    return super.iterator<ApiDailyBudgets>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiDailyBudgets>): Promise<DailyBudgets>;
  update(
    id: number,
    data: Partial<ApiDailyBudgets>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiDailyBudgets, any>>;
  update(id: number, data: Partial<ApiDailyBudgets>, options: Options<InternalQueryParams>): Promise<ApiDailyBudgets>;
  update(id: number, data: Partial<ApiDailyBudgets>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiDailyBudgets>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new DailyBudgets(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }
}

export { DailyBudgetsService };
