import { AxiosResponse } from 'axios';
import { ApiLeave, ApiLeaveType } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Leave } from '../models/leave.model.js';

import { LeaveQueryParams } from '../interfaces/query-params/leave-query-params.interface.js';

import { LeaveType } from '../models/leave-type.model.js';

type RequiredProps = 'users' | 'type' | 'start_date' | 'end_date';

export class LeaveService extends Service {
  private apiPath = '/leave';

  create(data: RequirementsOf<ApiLeave, RequiredProps>): Promise<Leave[]>;
  create(
    data: RequirementsOf<ApiLeave, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeave[], any>>;
  create(data: RequirementsOf<ApiLeave, RequiredProps>, options: Options): Promise<Leave[]>;
  create(data: RequirementsOf<ApiLeave, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLeave[]>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : [...res.data.map((leave) => new Leave(leave))]));
  }

  get(id: number): Promise<Leave>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<ApiLeave, any>>;
  get(id: number, options: Options): Promise<Leave>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLeave>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Leave(res.data)));
  }

  async *list(query: LeaveQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLeave>({ url: this.apiPath, params: query }, options)) {
      yield new Leave(res);
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
    for await (const res of super.iterator<ApiLeaveType>({ url: this.apiPath, params: query }, options)) {
      yield new LeaveType(res);
    }
  }

  listByPage(query: LeaveQueryParams, options?: Options) {
    return super.iterator<ApiLeave>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeave>): Promise<Leave>;
  update(
    id: number,
    data: Partial<ApiLeave>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeave, any>>;
  update(id: number, data: Partial<ApiLeave>, options: Options): Promise<Leave>;
  update(id: number, data: Partial<ApiLeave>, options?: Options) {
    return super
      .fetch<ApiLeave>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Leave(res.data)));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiLeave, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiLeave>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
