import { AxiosResponse } from 'axios';
import { ApiLeaveRequest } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveRequestsQueryParams } from '../interfaces/query-params/leave-requests-query-params.interface.js';

import { LeaveRequest } from '../models/leave-request.model.js';

type RequiredProps = 'start_date' | 'end_date' | 'type' | 'user';

export class LeaveRequestService extends Service {
  private apiPath = '/leave_requests';

  create(data: RequirementsOf<ApiLeaveRequest, RequiredProps>): Promise<LeaveRequest>;
  create(
    data: RequirementsOf<ApiLeaveRequest, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  create(data: RequirementsOf<ApiLeaveRequest, RequiredProps>, options: Options): Promise<LeaveRequest>;
  create(data: RequirementsOf<ApiLeaveRequest, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLeaveRequest>({
        url: options?.dryRun ? `${this.apiPath}?dry_run=true` : this.apiPath,
        data,
        method: 'POST',
      })
      .then((res) => {
        if (options?.dryRun) {
          return Promise.resolve(res);
        }
        return Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data));
      });
  }

  get(id: number): Promise<LeaveRequest>;
  get(id: number, options: { rawResponse: true }): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  get(id: number, options: Options): Promise<LeaveRequest>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLeaveRequest>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data)));
  }

  async *list(query?: LeaveRequestsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLeaveRequest>({ url: this.apiPath, params: query }, options)) {
      yield new LeaveRequest(res);
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
    return super.iterator<ApiLeaveRequest>({ url: `${this.apiPath}`, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeaveRequest>): Promise<LeaveRequest>;
  update(
    id: number,
    data: Partial<ApiLeaveRequest>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  update(id: number, data: Partial<ApiLeaveRequest>, options: Options): Promise<LeaveRequest>;
  update(id: number, data: Partial<ApiLeaveRequest>, options?: Options) {
    return super
      .fetch<ApiLeaveRequest>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data)));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiLeaveRequest>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
