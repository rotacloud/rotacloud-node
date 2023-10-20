import { AxiosResponse } from 'axios';
import { DailyBudgets } from '../interfaces/daily-budgets.interface.js';
import { Service, Options, OptionsExtended } from './index.js';

import { DailyBudgetsQueryParams } from '../interfaces/query-params/daily-budgets-query-params.interface.js';

export class DailyBudgetsService extends Service<DailyBudgets> {
  private apiPath = '/daily_budgets';

  list(query: DailyBudgetsQueryParams): AsyncGenerator<DailyBudgets>;
  list<F extends keyof DailyBudgets>(
    query: DailyBudgetsQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyBudgets>,
  ): AsyncGenerator<Pick<DailyBudgets, F>>;
  list(query: DailyBudgetsQueryParams, options?: Options): AsyncGenerator<DailyBudgets>;
  async *list(query: DailyBudgetsQueryParams, options?: Options) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: DailyBudgetsQueryParams): Promise<DailyBudgets[]>;
  listAll<F extends keyof DailyBudgets>(
    query: DailyBudgetsQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyBudgets[]>,
  ): Promise<Pick<DailyBudgets, F>[]>;
  listAll(query: DailyBudgetsQueryParams, options?: OptionsExtended<DailyBudgets>): Promise<DailyBudgets[]>;
  async listAll(query: DailyBudgetsQueryParams, options?: Options) {
    const attendance = [] as DailyBudgets[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: DailyBudgetsQueryParams): AsyncGenerator<AxiosResponse<DailyBudgets[]>>;
  listByPage<F extends keyof DailyBudgets>(
    query: DailyBudgetsQueryParams,
    options: { fields: F[] } & OptionsExtended<DailyBudgets[]>,
  ): AsyncGenerator<AxiosResponse<Pick<DailyBudgets, F>[]>>;
  listByPage(
    query: DailyBudgetsQueryParams,
    options?: OptionsExtended<DailyBudgets>,
  ): AsyncGenerator<AxiosResponse<DailyBudgets[]>>;
  listByPage(query: DailyBudgetsQueryParams, options?: OptionsExtended<DailyBudgets>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(data: Partial<DailyBudgets>[]): Promise<number>;
  update(
    data: Partial<DailyBudgets>[],
    options: { rawResponse: true } & OptionsExtended<DailyBudgets>,
  ): Promise<AxiosResponse<number>>;
  update(data: Partial<DailyBudgets>[], options?: OptionsExtended<DailyBudgets>): Promise<number>;
  update(data: Partial<DailyBudgets>[], options?: OptionsExtended<DailyBudgets>) {
    return super
      .fetch<number>(
        {
          url: this.apiPath,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
