import { AxiosResponse } from 'axios';
import { Leave } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { LeaveQueryParams } from '../interfaces/query-params/leave-query-params.interface.js';

type RequiredProps = 'users' | 'type' | 'start_date' | 'end_date';

export class LeaveService extends Service<Leave> {
  private apiPath = '/leave';

  create(data: RequirementsOf<Leave, RequiredProps>): Promise<Leave[]>;
  create(
    data: RequirementsOf<Leave, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Leave[], any>>;
  create(data: RequirementsOf<Leave, RequiredProps>, options: Options): Promise<Leave[]>;
  create(data: RequirementsOf<Leave, RequiredProps>, options?: Options) {
    return super
      .fetch({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : [...res.data.map((leave) => leave)]));
  }

  get(id: number): Promise<Leave>;
  get<F extends keyof Leave>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Leave>,
  ): Promise<AxiosResponse<Pick<Leave, F>>>;
  get<F extends keyof Leave>(id: number, options: { fields: F[] } & OptionsExtended<Leave>): Promise<Pick<Leave, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Leave>>;
  get(id: number, options?: OptionsExtended<Leave>): Promise<Leave>;
  get(id: number, options?: OptionsExtended<Leave>) {
    return super
      .fetch<Leave>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: LeaveQueryParams): AsyncGenerator<Leave>;
  list<F extends keyof Leave>(
    query: LeaveQueryParams,
    options: { fields: F[] } & OptionsExtended<Leave>,
  ): AsyncGenerator<Pick<Leave, F>>;
  list(query: LeaveQueryParams, options?: OptionsExtended<Leave>): AsyncGenerator<Leave>;
  async *list(query: LeaveQueryParams, options?: OptionsExtended<Leave>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: LeaveQueryParams): Promise<Leave[]>;
  listAll<F extends keyof Leave>(
    query: LeaveQueryParams,
    options: { fields: F[] } & OptionsExtended<Leave[]>,
  ): Promise<Pick<Leave, F>[]>;
  listAll(query: LeaveQueryParams, options?: OptionsExtended<Leave>): Promise<Leave[]>;
  async listAll(query: LeaveQueryParams, options?: OptionsExtended<Leave>) {
    const leave = [] as Leave[];
    for await (const leaveRecord of this.list(query, options)) {
      leave.push(leaveRecord);
    }
    return leave;
  }

  listByPage(query: LeaveQueryParams): AsyncGenerator<AxiosResponse<Leave[]>>;
  listByPage<F extends keyof Leave>(
    query: LeaveQueryParams,
    options: { fields: F[] } & OptionsExtended<Leave[]>,
  ): AsyncGenerator<AxiosResponse<Pick<Leave, F>[]>>;
  listByPage(query: LeaveQueryParams, options?: OptionsExtended<Leave>): AsyncGenerator<AxiosResponse<Leave[]>>;
  listByPage(query: LeaveQueryParams, options?: OptionsExtended<Leave>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Leave>): Promise<Leave>;
  update(
    id: number,
    data: Partial<Leave>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Leave, any>>;
  update(id: number, data: Partial<Leave>, options: Options): Promise<Leave>;
  update(id: number, data: Partial<Leave>, options?: Options) {
    return super
      .fetch<Leave>(
        {
          url: `${this.apiPath}/${id}`,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.data));
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
