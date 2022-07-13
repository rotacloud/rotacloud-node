import { AxiosResponse } from 'axios';
import { ApiShift } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Shift } from '../models/shift.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { ShiftsQueryParams } from '../interfaces/query-params/shifts-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.interface.js';

type RequiredProps = 'end_time' | 'start_time' | 'location';

class ShiftsService extends Service {
  private apiPath = '/shifts';

  create(data: RequirementsOf<ApiShift, RequiredProps>): Promise<Shift>;
  create(
    data: RequirementsOf<ApiShift, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiShift, any>>;
  create(data: RequirementsOf<ApiShift, RequiredProps>, options: Options<InternalQueryParams>): Promise<Shift>;
  create(data: RequirementsOf<ApiShift, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Shift>;
  get(id: number, options: { rawResponse: true; params?: InternalQueryParams }): Promise<AxiosResponse<ApiShift, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<Shift>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<ShiftsQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiShift>({ url: this.apiPath }, options)) {
      yield new Shift(res);
    }
  }

  listAll(): Promise<Shift[]>;
  async listAll() {
    try {
      const shifts = [] as Shift[];
      for await (const shift of this.list()) {
        shifts.push(shift);
      }
      return shifts;
    } catch (err) {
      return err;
    }
  }

  listByPage(options?: Options<ShiftsQueryParams & InternalQueryParams>) {
    return super.iterator<ApiShift>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiShift>): Promise<Shift>;
  update(
    id: number,
    data: Partial<ApiShift>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiShift, any>>;
  update(id: number, data: Partial<ApiShift>, options: Options<InternalQueryParams>): Promise<Shift>;
  update(id: number, data: Partial<ApiShift>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiShift>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true; params?: InternalQueryParams }): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  acknowledge(data: number[]): Promise<number>;
  acknowledge(
    data: number[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<any, any>>;
  acknowledge(data: number[], options: Options<InternalQueryParams>): Promise<number>;
  acknowledge(data: number[], options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: '/shifts_acknowledged', data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  publish(data: number[]): Promise<number>;
  publish(
    data: number[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<any, any>>;
  publish(data: number[], options: Options<InternalQueryParams>): Promise<number>;
  publish(data: number[], options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: '/shifts_published', data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  unpublish(data: number[]): Promise<number>;
  unpublish(
    data: number[],
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<any, any>>;
  unpublish(data: number[], options: Options<InternalQueryParams>): Promise<number>;
  unpublish(data: number[], options?: Options<InternalQueryParams>) {
    return super.fetch<ApiShift>({ url: '/shifts_published', data, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { ShiftsService };
