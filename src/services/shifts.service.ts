import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiShift } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Shift } from '../models/shift.model.js';

import { ShiftsQueryParams } from '../interfaces/query-params/shifts-query-params.interface.js';

type RequiredProps = 'end_time' | 'start_time' | 'location';

export class ShiftsService extends Service {
  private apiPath = '/shifts';

  create(data: RequirementsOf<ApiShift, RequiredProps>): Promise<Shift>;
  create(
    data: RequirementsOf<ApiShift, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiShift, any>>;
  create(data: RequirementsOf<ApiShift, RequiredProps>, options: Options): Promise<Shift>;
  create(data: RequirementsOf<ApiShift, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiShift>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)));
  }

  get(id: number): Promise<Shift>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiShift, any>>;
  get(id: number, options: Options): Promise<Shift>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiShift>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)));
  }

  async *list(query: ShiftsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiShift>({ url: this.apiPath, params: query }, options)) {
      yield new Shift(res);
    }
  }

  listAll(query: ShiftsQueryParams, options?: Options): Promise<Shift[]>;
  async listAll(query: ShiftsQueryParams, options?: Options) {
    const shifts = [] as Shift[];
    for await (const shift of this.list(query, options)) {
      shifts.push(shift);
    }
    return shifts;
  }

  listByPage(query: ShiftsQueryParams, options?: Options) {
    return super.iterator<ApiShift>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiShift>): Promise<Shift>;
  update(
    id: number,
    data: Partial<ApiShift>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiShift, any>>;
  update(id: number, data: Partial<ApiShift>, options: Options): Promise<Shift>;
  update(id: number, data: Partial<ApiShift>, options?: Options) {
    return super
      .fetch<ApiShift>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Shift(res.data)));
  }

  delete(ids: number | number[]): Promise<number>;
  delete(ids: number | number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(ids: number | number[], options: Options): Promise<number>;
  delete(ids: number | number[], options?: Options) {
    const params: AxiosRequestConfig =
      typeof ids !== 'number'
        ? { url: this.apiPath, data: ids, method: 'DELETE' }
        : { url: `${this.apiPath}/${ids}`, method: 'DELETE' };

    return super.fetch<ApiShift>(params).then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  acknowledge(data: number[]): Promise<number>;
  acknowledge(data: number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  acknowledge(data: number[], options: Options): Promise<number>;
  acknowledge(data: number[], options?: Options) {
    return super
      .fetch<ApiShift>({ url: '/shifts_acknowledged', data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  publish(data: { shifts: number[] }): Promise<number>;
  publish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  publish(data: { shifts: number[] }, options: Options): Promise<number>;
  publish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<ApiShift>({ url: '/shifts_published', data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  unpublish(data: { shifts: number[] }): Promise<number>;
  unpublish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  unpublish(data: { shifts: number[] }, options: Options): Promise<number>;
  unpublish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<ApiShift>({ url: '/shifts_published', data, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
