import { AxiosResponse } from 'axios';
import { ApiAttendance } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Attendance } from '../models/attendance.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { AttendanceQueryParams } from '../interfaces/query-params/attendance-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.interface.js';

type RequiredProps = 'user' | 'in_time';

class AttendanceService extends Service {
  private apiPath = '/attendance';

  create(data: RequirementsOf<ApiAttendance, RequiredProps>): Promise<Attendance>;
  create(
    data: RequirementsOf<ApiAttendance, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  create(
    data: RequirementsOf<ApiAttendance, RequiredProps>,
    options: Options<InternalQueryParams>
  ): Promise<ApiAttendance>;
  create(data: RequirementsOf<ApiAttendance, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiAttendance>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Attendance(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Attendance>;
  get(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<ApiAttendance>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiAttendance>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Attendance(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<AttendanceQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiAttendance>({ url: this.apiPath }, options)) {
      yield new Attendance(res);
    }
  }

  listAll(): Promise<Attendance[]>;
  async listAll() {
    try {
      const attendance = [] as Attendance[];
      for await (const atten of this.list()) {
        attendance.push(atten);
      }
      return attendance;
    } catch (err) {
      return err;
    }
  }

  listByPage(options?: Options<AttendanceQueryParams & InternalQueryParams>) {
    return super.iterator<ApiAttendance>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiAttendance>): Promise<Attendance>;
  update(
    id: number,
    data: Partial<ApiAttendance>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  update(id: number, data: Partial<ApiAttendance>, options: Options<InternalQueryParams>): Promise<Attendance>;
  update(id: number, data: Partial<ApiAttendance>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiAttendance>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Attendance(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiAttendance, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiAttendance>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { AttendanceService };
