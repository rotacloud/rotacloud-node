import { AxiosResponse } from 'axios';
import { Attendance } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { AttendanceQueryParams } from '../interfaces/query-params/attendance-query-params.interface.js';

type RequiredProps = 'user' | 'in_time';

export class AttendanceService extends Service {
  private apiPath = '/attendance';

  create(data: RequirementsOf<Attendance, RequiredProps>): Promise<Attendance>;
  create(
    data: RequirementsOf<Attendance, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Attendance, any>>;
  create(data: RequirementsOf<Attendance, RequiredProps>, options: Options): Promise<Attendance>;
  create(data: RequirementsOf<Attendance, RequiredProps>, options?: Options) {
    return super
      .fetch<Attendance>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Attendance>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Attendance, any>>;
  get(id: number, options: Options): Promise<Attendance>;
  get(id: number, options?: Options) {
    return super
      .fetch<Attendance>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: AttendanceQueryParams, options?: Options) {
    for await (const res of super.iterator<Attendance>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: AttendanceQueryParams, options?: Options): Promise<Attendance[]>;
  async listAll(query: AttendanceQueryParams, options?: Options) {
    const attendance = [] as Attendance[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: AttendanceQueryParams, options?: Options) {
    return super.iterator<Attendance>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Attendance>): Promise<Attendance>;
  update(
    id: number,
    data: Partial<Attendance>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Attendance, any>>;
  update(id: number, data: Partial<Attendance>, options: Options): Promise<Attendance>;
  update(id: number, data: Partial<Attendance>, options?: Options) {
    return super
      .fetch<Attendance>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Attendance, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<Attendance>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
