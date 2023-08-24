import { AxiosResponse } from 'axios';
import { ApiLeaveType } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class LeaveTypesService extends Service {
  private apiPath = '/leave_types';

  get(): Promise<ApiLeaveType[]>;
  get(options: { rawResponse: true }): Promise<AxiosResponse<ApiLeaveType[]>>;
  get(options: Options): Promise<ApiLeaveType[]>;
  get(options?: Options) {
    return super
      .fetch<ApiLeaveType[]>({ url: this.apiPath }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data.map((leaveType) => leaveType)));
  }
}
