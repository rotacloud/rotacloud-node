import { AxiosResponse } from 'axios';
import { ApiLeave, ApiLeaveType } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Leave } from '../models/leave.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { LeaveQueryParams } from '../interfaces/query-params/leave-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';
import { LeaveType } from '../models/leave-type.model.js';

type RequiredProps = 'users' | 'type' | 'start_date' | 'end_date';

class LeaveService extends Service {
  private apiPath = '/leave';

  create(data: RequirementsOf<ApiLeave, RequiredProps>): Promise<Leave[]>;
  create(
    data: RequirementsOf<ApiLeave, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeave[], any>>;
  create(data: RequirementsOf<ApiLeave, RequiredProps>, options: Options<InternalQueryParams>): Promise<Leave[]>;
  create(data: RequirementsOf<ApiLeave, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeave[]>({ url: `${this.apiPath}`, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : [...res.data.map((leave) => new Leave(leave))]),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Leave>;
  get(id: number, options: { rawResponse: true; params?: InternalQueryParams }): Promise<AxiosResponse<ApiLeave, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<Leave>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeave>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Leave(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<LeaveQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiLeave>({ url: this.apiPath }, options)) {
      yield new Leave(res);
    }
  }

  listAll(): Promise<Leave[]>;
  async listAll() {
    try {
      const leave = [] as Leave[];
      for await (const leaveRecord of this.list()) {
        leave.push(leaveRecord);
      }
      return leave;
    } catch (err) {
      return err;
    }
  }

  async *listLeaveTypes(options?: Options<InternalQueryParams>) {
    for await (const res of super.iterator<ApiLeaveType>({ url: this.apiPath }, options)) {
      yield new LeaveType(res);
    }
  }

  listByPage(options?: Options<LeaveQueryParams & InternalQueryParams>) {
    return super.iterator<ApiLeave>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeave>): Promise<Leave>;
  update(
    id: number,
    data: Partial<ApiLeave>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeave, any>>;
  update(id: number, data: Partial<ApiLeave>, options: Options<InternalQueryParams>): Promise<Leave>;
  update(id: number, data: Partial<ApiLeave>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiLeave>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Leave(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeave, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeave>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { LeaveService };
