import { AxiosResponse } from 'axios';
import { ApiLeaveRequest } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { ErrorResponse } from '../models/error-response.model.js';
import { LeaveQueryParams } from '../interfaces/query-params/leave-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';
import { LeaveRequest } from '../models/leave-request.model.js';

type RequiredProps = 'start_date' | 'end_date' | 'type' | 'user';

class LeaveRequestService extends Service {
  private apiPath = '/leave_requests';

  create(data: RequirementsOf<ApiLeaveRequest, RequiredProps>): Promise<LeaveRequest>;
  create(
    data: RequirementsOf<ApiLeaveRequest, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  create(
    data: RequirementsOf<ApiLeaveRequest, RequiredProps>,
    options: Options<InternalQueryParams>
  ): Promise<LeaveRequest>;
  create(data: RequirementsOf<ApiLeaveRequest, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveRequest>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<LeaveRequest>;
  get(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<LeaveRequest>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveRequest>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<LeaveQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiLeaveRequest>({ url: `${this.apiPath}` }, options)) {
      yield new LeaveRequest(res);
    }
  }

  listByPage(options?: Options<LeaveQueryParams & InternalQueryParams>) {
    return super.iterator<ApiLeaveRequest>({ url: `${this.apiPath}` }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeaveRequest>): Promise<LeaveRequest>;
  update(
    id: number,
    data: Partial<ApiLeaveRequest>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  update(id: number, data: Partial<ApiLeaveRequest>, options: Options<InternalQueryParams>): Promise<LeaveRequest>;
  update(id: number, data: Partial<ApiLeaveRequest>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiLeaveRequest>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new LeaveRequest(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveRequest, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveRequest>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { LeaveRequestService };
