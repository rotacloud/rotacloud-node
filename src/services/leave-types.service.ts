import { AxiosResponse } from 'axios';
import { LeaveType } from '../interfaces/index.js';
import { Service, Options } from './index.js';

export class LeaveTypesService extends Service {
  private apiPath = '/leave_types';

  get(): Promise<LeaveType[]>;
  get(options: { rawResponse: true }): Promise<AxiosResponse<LeaveType[]>>;
  get(options: Options): Promise<LeaveType[]>;
  get(options?: Options) {
    return super
      .fetch<LeaveType[]>({ url: this.apiPath }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data.map((leaveType) => leaveType)));
  }
}
