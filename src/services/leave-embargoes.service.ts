import { AxiosResponse } from 'axios';
import { ApiLeaveEmbargo } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveEmbargoesQueryParams } from '../rotacloud.js';

type RequiredProps = 'start_date' | 'end_date' | 'users';

export class LeaveEmbargoesService extends Service {
  private apiPath = '/leave_embargoes';

  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>): Promise<ApiLeaveEmbargo>;
  create(
    data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>, options: Options): Promise<ApiLeaveEmbargo>;
  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiLeaveEmbargo>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  get(id: number, options: Options): Promise<ApiLeaveEmbargo>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: LeaveEmbargoesQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLeaveEmbargo>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: LeaveEmbargoesQueryParams, options?: Options): Promise<ApiLeaveEmbargo[]>;
  async listAll(query: LeaveEmbargoesQueryParams, options?: Options) {
    const leave = [] as ApiLeaveEmbargo[];
    for await (const leaveEmbargoRecord of this.list(query, options)) {
      leave.push(leaveEmbargoRecord);
    }
    return leave;
  }

  listByPage(query: LeaveEmbargoesQueryParams, options?: Options) {
    return super.iterator<ApiLeaveEmbargo>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeaveEmbargo>): Promise<ApiLeaveEmbargo>;
  update(
    id: number,
    data: Partial<ApiLeaveEmbargo>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options: Options): Promise<ApiLeaveEmbargo>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options?: Options) {
    return super
      .fetch<ApiLeaveEmbargo>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
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
