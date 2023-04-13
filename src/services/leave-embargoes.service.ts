import { AxiosResponse } from 'axios';
import { ApiLeaveEmbargo } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveEmbargo } from '../models/leave-embargo.model.js';
import { LeaveEmbargoesQueryParams } from '../rotacloud.js';

type RequiredProps = 'start_date' | 'end_date' | 'users';

export class LeaveEmbargoesService extends Service {
  private apiPath = '/leave_embargoes';

  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>): Promise<LeaveEmbargo>;
  create(
    data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>, options: Options): Promise<LeaveEmbargo>;
  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)));
  }

  get(id: number): Promise<LeaveEmbargo>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  get(id: number, options: Options): Promise<LeaveEmbargo>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)));
  }

  async *list(query: LeaveEmbargoesQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLeaveEmbargo>({ url: this.apiPath, params: query }, options)) {
      yield new LeaveEmbargo(res);
    }
  }

  listAll(query: LeaveEmbargoesQueryParams, options?: Options): Promise<LeaveEmbargo[]>;
  async listAll(query: LeaveEmbargoesQueryParams, options?: Options) {
    const leave = [] as LeaveEmbargo[];
    for await (const leaveEmbargoRecord of this.list(query, options)) {
      leave.push(leaveEmbargoRecord);
    }
    return leave;
  }

  listByPage(query: LeaveEmbargoesQueryParams, options?: Options) {
    return super.iterator<ApiLeaveEmbargo>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeaveEmbargo>): Promise<LeaveEmbargo>;
  update(
    id: number,
    data: Partial<ApiLeaveEmbargo>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options: Options): Promise<LeaveEmbargo>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
