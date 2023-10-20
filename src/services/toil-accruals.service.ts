import { AxiosResponse } from 'axios';
import { Options, RequirementsOf, Service } from './service';
import { ToilAccrualsQueryParams } from '../interfaces/query-params/toil-accruals-query-params.interface';
import { ToilAccrual } from '../interfaces/toil-accrual.interface';

type RequiredProps = 'duration_hours' | 'leave_year' | 'user_id';

export class ToilAccrualsService extends Service {
  private apiPath = '/toil_accruals';

  create(data: RequirementsOf<ToilAccrual, RequiredProps>): Promise<ToilAccrual>;
  create(
    data: RequirementsOf<ToilAccrual, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ToilAccrual, any>>;
  create(data: RequirementsOf<ToilAccrual, RequiredProps>, options: Options): Promise<ToilAccrual>;
  create(data: RequirementsOf<ToilAccrual, RequiredProps>, options?: Options) {
    return super
      .fetch<ToilAccrual>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ToilAccrual>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ToilAccrual, any>>;
  get(id: number, options: Options): Promise<ToilAccrual>;
  get(id: number, options?: Options) {
    return super
      .fetch<ToilAccrual>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  async *list(query: ToilAccrualsQueryParams, options?: Options) {
    yield* super.iterator<ToilAccrual>({ url: this.apiPath, params: query }, options);
  }

  async listAll(query: ToilAccrualsQueryParams, options?: Options): Promise<ToilAccrual[]> {
    const toilAccruals = [] as ToilAccrual[];
    for await (const accrual of this.list(query, options)) {
      toilAccruals.push(accrual);
    }
    return toilAccruals;
  }

  listByPage(query: ToilAccrualsQueryParams, options?: Options) {
    return super.iterator<ToilAccrual>({ url: this.apiPath, params: query }, options).byPage();
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
