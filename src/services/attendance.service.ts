import { AxiosResponse } from 'axios';
import { Attendance } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { AttendanceQueryParams } from '../interfaces/query-params/attendance-query-params.interface.js';

type RequiredProps = 'user' | 'in_time';

export class AttendanceService extends Service<Attendance> {
  private apiPath = '/attendance';

  create(data: RequirementsOf<Attendance, RequiredProps>): Promise<Attendance>;
  create(
    data: RequirementsOf<Attendance, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Attendance>>;
  create(data: RequirementsOf<Attendance, RequiredProps>, options: Options): Promise<Attendance>;
  create(data: RequirementsOf<Attendance, RequiredProps>, options?: Options) {
    return super
      .fetch<Attendance>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Attendance>;
  get<F extends keyof Attendance>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Attendance>,
  ): Promise<AxiosResponse<Pick<Attendance, F>>>;
  get<F extends keyof Attendance>(
    id: number,
    options: { fields: F[] } & OptionsExtended<Attendance>,
  ): Promise<Pick<Attendance, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Attendance>>;
  get(id: number, options?: OptionsExtended<Attendance>): Promise<Attendance>;
  get(id: number, options?: OptionsExtended<Attendance>) {
    return super
      .fetch<Attendance>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: AttendanceQueryParams): AsyncGenerator<Attendance>;
  list<F extends keyof Attendance>(
    query: AttendanceQueryParams,
    options: { fields: F[] } & OptionsExtended<Attendance>,
  ): AsyncGenerator<Pick<Attendance, F>>;
  list(query: AttendanceQueryParams, options?: OptionsExtended<Attendance>): AsyncGenerator<Attendance>;
  async *list(query: AttendanceQueryParams, options?: OptionsExtended<Attendance>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: AttendanceQueryParams): Promise<Attendance[]>;
  listAll<F extends keyof Attendance>(
    query: AttendanceQueryParams,
    options: { fields: F[] } & OptionsExtended<Attendance>,
  ): Promise<Pick<Attendance, F>[]>;
  listAll(query: AttendanceQueryParams, options?: OptionsExtended<Attendance>): Promise<Attendance[]>;
  async listAll(query: AttendanceQueryParams, options?: OptionsExtended<Attendance>) {
    const attendance = [] as Attendance[];
    for await (const atten of this.list(query, options)) {
      attendance.push(atten);
    }
    return attendance;
  }

  listByPage(query: AttendanceQueryParams): AsyncGenerator<AxiosResponse<Attendance[]>>;
  listByPage<F extends keyof Attendance>(
    query: AttendanceQueryParams,
    options: { fields: F[] } & OptionsExtended<Attendance>,
  ): AsyncGenerator<AxiosResponse<Pick<Attendance, F>[]>>;
  listByPage(
    query: AttendanceQueryParams,
    options?: OptionsExtended<Attendance>,
  ): AsyncGenerator<AxiosResponse<Attendance[]>>;
  listByPage(query: AttendanceQueryParams, options?: OptionsExtended<Attendance>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Attendance>): Promise<Attendance>;
  update(
    id: number,
    data: Partial<Attendance>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Attendance>>;
  update(id: number, data: Partial<Attendance>, options: Options): Promise<Attendance>;
  update(id: number, data: Partial<Attendance>, options?: Options) {
    return super
      .fetch<Attendance>(
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
  delete(id: number, options?: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
