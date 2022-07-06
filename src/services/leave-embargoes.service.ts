import { AxiosResponse } from 'axios';
import { ApiLeaveEmbargo } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LeaveEmbargo } from '../models/leave-embargo.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { UsersQueryParams } from '../interfaces/query-params/users-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.interface.js';

type RequiredProps = 'start_date' | 'end_date' | 'users';

class LeaveEmbargoesService extends Service {
  private apiPath = '/leave_embargoes';

  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>): Promise<LeaveEmbargo>;
  create(
    data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  create(
    data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>,
    options: Options<InternalQueryParams>
  ): Promise<LeaveEmbargo>;
  create(data: RequirementsOf<ApiLeaveEmbargo, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveEmbargo>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<LeaveEmbargo>;
  get(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<LeaveEmbargo>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveEmbargo>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<UsersQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiLeaveEmbargo>({ url: this.apiPath }, options)) {
      yield new LeaveEmbargo(res);
    }
  }

  listAll(): Promise<LeaveEmbargo[]>;
  async listAll() {
    try {
      const leave = [] as LeaveEmbargo[];
      for await (const leaveEmbargoRecord of this.list()) {
        leave.push(leaveEmbargoRecord);
      }
      return leave;
    } catch (err) {
      return err;
    }
  }

  listByPage(options?: Options<UsersQueryParams & InternalQueryParams>) {
    return super.iterator<ApiLeaveEmbargo>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiLeaveEmbargo>): Promise<LeaveEmbargo>;
  update(
    id: number,
    data: Partial<ApiLeaveEmbargo>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLeaveEmbargo, any>>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options: Options<InternalQueryParams>): Promise<LeaveEmbargo>;
  update(id: number, data: Partial<ApiLeaveEmbargo>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiLeaveEmbargo>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new LeaveEmbargo(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true; params?: InternalQueryParams }): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLeaveEmbargo>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { LeaveEmbargoesService };
