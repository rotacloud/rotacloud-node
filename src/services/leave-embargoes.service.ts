import { AxiosResponse } from 'axios';
import { LeaveEmbargo } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveEmbargoesQueryParams } from '../rotacloud.js';

type RequiredProps = 'start_date' | 'end_date' | 'users';

export class LeaveEmbargoesService extends Service<LeaveEmbargo> {
  private apiPath = '/leave_embargoes';

  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>): Promise<LeaveEmbargo>;
  create(
    data: RequirementsOf<LeaveEmbargo, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveEmbargo, any>>;
  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>, options: Options): Promise<LeaveEmbargo>;
  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>, options?: Options) {
    return super
      .fetch<LeaveEmbargo>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<LeaveEmbargo>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<LeaveEmbargo, any>>;
  get(id: number, options: Options): Promise<LeaveEmbargo>;
  get(id: number, options?: Options) {
    return super
      .fetch<LeaveEmbargo>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: LeaveEmbargoesQueryParams, options?: Options) {
    for await (const res of super.iterator<LeaveEmbargo>({ url: this.apiPath, params: query }, options)) {
      yield res;
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
    return super.iterator<LeaveEmbargo>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<LeaveEmbargo>): Promise<LeaveEmbargo>;
  update(
    id: number,
    data: Partial<LeaveEmbargo>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveEmbargo, any>>;
  update(id: number, data: Partial<LeaveEmbargo>, options: Options): Promise<LeaveEmbargo>;
  update(id: number, data: Partial<LeaveEmbargo>, options?: Options) {
    return super
      .fetch<LeaveEmbargo>({
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
      .fetch<LeaveEmbargo>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
