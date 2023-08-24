import { AxiosResponse } from 'axios';
import { ApiAttendance } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { AttendanceQueryParams } from '../interfaces/query-params/attendance-query-params.interface.js';

type RequiredProps = 'user' | 'in_time';

export class AttendanceService extends Service {
  private apiPath = '/attendance';

  create(data: RequirementsOf<ApiAttendance, RequiredProps>): Promise<ApiAttendance>;
  create(
    data: RequirementsOf<ApiAttendance, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  create(data: RequirementsOf<ApiAttendance, RequiredProps>, options: Options): Promise<ApiAttendance>;
  create(data: RequirementsOf<ApiAttendance, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiAttendance>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiAttendance>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAttendance, any>>;
  get(id: number, options: Options): Promise<ApiAttendance>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiAttendance>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: AttendanceQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiAttendance>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: AttendanceQueryParams, options?: Options): Promise<ApiAttendance[]>;
  async listAll(query: AttendanceQueryParams, options?: Options) {
    const attendance = [] as ApiAttendance[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: AttendanceQueryParams, options?: Options) {
    return super.iterator<ApiAttendance>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiAttendance>): Promise<ApiAttendance>;
  update(
    id: number,
    data: Partial<ApiAttendance>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  update(id: number, data: Partial<ApiAttendance>, options: Options): Promise<ApiAttendance>;
  update(id: number, data: Partial<ApiAttendance>, options?: Options) {
    return super
      .fetch<ApiAttendance>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAttendance, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiAttendance>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
