import { AxiosResponse } from 'axios';
import { Options, Service } from './service';
import { ToilAccrualsQueryParams } from '../interfaces/query-params/toil-accruals-query-params.interface';
import { ToilAccrual } from '../models/toil-accrual.model';
import { ApiToilAccrual } from '../interfaces/toil-accrual.interface';

export class ToilAccrualsService extends Service {
  private apiPath = '/toil_accruals';

  get(id: number): Promise<ToilAccrual>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ToilAccrual, any>>;
  get(id: number, options: Options): Promise<ToilAccrual>;
  get(id: number, options?: Options) {
    return super
      .fetch<ToilAccrual>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new ToilAccrual(res.data)));
  }

  async *list(query: ToilAccrualsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiToilAccrual>({ url: this.apiPath, params: query }, options)) {
      yield new ToilAccrual(res);
    }
  }

  listAll(query: ToilAccrualsQueryParams, options?: Options): Promise<ToilAccrual[]>;
  async listAll(query: ToilAccrualsQueryParams, options?: Options) {
    const toilAccruals = [] as ToilAccrual[];
    for await (const accrual of this.list(query, options)) {
      toilAccruals.push(accrual);
    }
    return toilAccruals;
  }

  listByPage(query: ToilAccrualsQueryParams, options?: Options) {
    return super.iterator<ApiToilAccrual>({ url: this.apiPath, params: query }, options).byPage();
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiToilAccrual>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
