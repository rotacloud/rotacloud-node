import { AxiosResponse } from 'axios';
import { LeaveRequest } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { LeaveRequestsQueryParams } from '../interfaces/query-params/leave-requests-query-params.interface.js';

type RequiredProps = 'start_date' | 'end_date' | 'type' | 'user';

export class LeaveRequestService extends Service<LeaveRequest> {
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
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<LeaveRequest>;
  get<F extends keyof LeaveRequest>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<LeaveRequest>,
  ): Promise<AxiosResponse<Pick<LeaveRequest, F>>>;
  get<F extends keyof LeaveRequest>(
    id: number,
    options: { fields: F[] } & OptionsExtended<LeaveRequest>,
  ): Promise<Pick<LeaveRequest, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<LeaveRequest>>;
  get(id: number, options?: OptionsExtended<LeaveRequest>): Promise<LeaveRequest>;
  get(id: number, options?: OptionsExtended<LeaveRequest>) {
    return super
      .fetch<LeaveRequest>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: LeaveRequestsQueryParams): AsyncGenerator<LeaveRequest>;
  list<F extends keyof LeaveRequest>(
    query: LeaveRequestsQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveRequest>,
  ): AsyncGenerator<Pick<LeaveRequest, F>>;
  list(query: LeaveRequestsQueryParams, options?: OptionsExtended<LeaveRequest>): AsyncGenerator<LeaveRequest>;
  async *list(query?: LeaveRequestsQueryParams, options?: OptionsExtended<LeaveRequest>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: LeaveRequestsQueryParams): Promise<LeaveRequest[]>;
  listAll<F extends keyof LeaveRequest>(
    query: LeaveRequestsQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveRequest[]>,
  ): Promise<Pick<LeaveRequest, F>[]>;
  listAll(query: LeaveRequestsQueryParams, options?: OptionsExtended<LeaveRequest>): Promise<LeaveRequest[]>;
  async listAll(query: LeaveRequestsQueryParams, options?: OptionsExtended<LeaveRequest>) {
    const leave = [] as LeaveRequest[];
    for await (const leaveRequestRecord of this.list(query, options)) {
      leave.push(leaveRequestRecord);
    }
    return leave;
  }

  listByPage(query: LeaveRequestsQueryParams): AsyncGenerator<AxiosResponse<LeaveRequest[]>>;
  listByPage<F extends keyof LeaveRequest>(
    query: LeaveRequestsQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveRequest[]>,
  ): AsyncGenerator<AxiosResponse<Pick<LeaveRequest, F>[]>>;
  listByPage(
    query: LeaveRequestsQueryParams,
    options?: OptionsExtended<LeaveRequest>,
  ): AsyncGenerator<AxiosResponse<LeaveRequest[]>>;
  listByPage(query?: LeaveRequestsQueryParams, options?: OptionsExtended<LeaveRequest>) {
    return super.iterator({ url: `${this.apiPath}`, params: query }, options).byPage();
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
      .fetch<LeaveRequest>(
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
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
