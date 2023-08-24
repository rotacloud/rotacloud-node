import { AxiosResponse } from 'axios';
import { LeaveRequest } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveRequestsQueryParams } from '../interfaces/query-params/leave-requests-query-params.interface.js';

type RequiredProps = 'start_date' | 'end_date' | 'type' | 'user';

export class LeaveRequestService extends Service {
  private apiPath = '/leave_requests';

  create(data: RequirementsOf<LeaveRequest, RequiredProps>): Promise<LeaveRequest>;
  create(
    data: RequirementsOf<LeaveRequest, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveRequest, any>>;
  create(data: RequirementsOf<LeaveRequest, RequiredProps>, options: Options): Promise<LeaveRequest>;
  create(data: RequirementsOf<LeaveRequest, RequiredProps>, options?: Options) {
    return super
      .fetch<LeaveRequest>(
        {
          url: this.apiPath,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<LeaveRequest>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<LeaveRequest, any>>;
  get(id: number, options: Options): Promise<LeaveRequest>;
  get(id: number, options?: Options) {
    return super
      .fetch<LeaveRequest>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: LeaveRequestsQueryParams, options?: Options) {
    for await (const res of super.iterator<LeaveRequest>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: LeaveRequestsQueryParams, options?: Options): Promise<LeaveRequest[]>;
  async listAll(query: LeaveRequestsQueryParams, options?: Options) {
    const leave = [] as LeaveRequest[];
    for await (const leaveRequestRecord of this.list(query, options)) {
      leave.push(leaveRequestRecord);
    }
    return leave;
  }

  listByPage(query?: LeaveRequestsQueryParams, options?: Options) {
    return super.iterator<LeaveRequest>({ url: `${this.apiPath}`, params: query }, options).byPage();
  }

  update(id: number, data: Partial<LeaveRequest>): Promise<LeaveRequest>;
  update(
    id: number,
    data: Partial<LeaveRequest>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveRequest, any>>;
  update(id: number, data: Partial<LeaveRequest>, options: Options): Promise<LeaveRequest>;
  update(id: number, data: Partial<LeaveRequest>, options?: Options) {
    return super
      .fetch<LeaveRequest>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<LeaveRequest, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<LeaveRequest>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
