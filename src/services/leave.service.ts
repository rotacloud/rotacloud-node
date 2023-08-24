import { AxiosResponse } from 'axios';
import { Leave, LeaveType } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveQueryParams } from '../interfaces/query-params/leave-query-params.interface.js';

type RequiredProps = 'users' | 'type' | 'start_date' | 'end_date';

export class LeaveService extends Service {
  private apiPath = '/leave';

  create(data: RequirementsOf<Leave, RequiredProps>): Promise<Leave[]>;
  create(
    data: RequirementsOf<Leave, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Leave[], any>>;
  create(data: RequirementsOf<Leave, RequiredProps>, options: Options): Promise<Leave[]>;
  create(data: RequirementsOf<Leave, RequiredProps>, options?: Options) {
    return super
      .fetch<Leave[]>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : [...res.data.map((leave) => leave)]));
  }

  get(id: number): Promise<Leave>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<Leave, any>>;
  get(id: number, options: Options): Promise<Leave>;
  get(id: number, options?: Options) {
    return super
      .fetch<Leave>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: LeaveQueryParams, options?: Options) {
    for await (const res of super.iterator<Leave>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: LeaveQueryParams, options?: Options): Promise<Leave[]>;
  async listAll(query: LeaveQueryParams, options?: Options) {
    const leave = [] as Leave[];
    for await (const leaveRecord of this.list(query, options)) {
      leave.push(leaveRecord);
    }
    return leave;
  }

  async *listLeaveTypes(query: LeaveQueryParams, options?: Options) {
    for await (const res of super.iterator<LeaveType>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listByPage(query: LeaveQueryParams, options?: Options) {
    return super.iterator<Leave>({ url: this.apiPath, params: query }, options).byPage();
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
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Leave, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<Leave>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
