import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Shift } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { ShiftsQueryParams } from '../interfaces/query-params/shifts-query-params.interface.js';

type RequiredProps = 'end_time' | 'start_time' | 'location';

export class ShiftsService extends Service {
  private apiPath = '/shifts';

  create(data: RequirementsOf<Shift, RequiredProps>): Promise<Shift>;
  create(
    data: RequirementsOf<Shift, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Shift, any>>;
  create(data: RequirementsOf<Shift, RequiredProps>, options: Options): Promise<Shift>;
  create(data: RequirementsOf<Shift, RequiredProps>, options?: Options) {
    return super
      .fetch<Shift>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Shift>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Shift, any>>;
  get(id: number, options: Options): Promise<Shift>;
  get(id: number, options?: Options) {
    return super
      .fetch<Shift>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: ShiftsQueryParams, options?: Options) {
    for await (const res of super.iterator<Shift>({ url: this.apiPath, params: query }, options)) {
      yield res;
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
    return super.iterator<Shift>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(shift: RequirementsOf<Shift, 'id'>): Promise<Shift>;
  update(shift: RequirementsOf<Shift, 'id'>, options: { rawResponse: true } & Options): Promise<AxiosResponse<Shift>>;
  update(shift: RequirementsOf<Shift, 'id'>, options: Options): Promise<Shift>;
  update(shifts: RequirementsOf<Shift, 'id'>[]): Promise<{ success: Shift[]; failed: { id: number; error: string }[] }>;
  update(shift: RequirementsOf<Shift, 'id'>, options: Options): Promise<Shift>;
  update(
    shifts: RequirementsOf<Shift, 'id'>[],
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<{ code: number; data?: Shift; error?: string }[]>>;
  update(
    shifts: RequirementsOf<Shift, 'id'>[],
    options: Options,
  ): Promise<{ success: Shift[]; failed: { id: number; error: string }[] }>;
  update(shifts: RequirementsOf<Shift, 'id'> | RequirementsOf<Shift, 'id'>[], options?: Options) {
    if (!Array.isArray(shifts)) {
      return super
        .fetch<Shift>({
          url: `${this.apiPath}/${shifts.id}`,
          data: shifts,
          method: 'POST',
        })
        .then((res) => (options?.rawResponse ? res : res.data));
    }

    return super
      .fetch<{ code: number; data?: Shift; error?: string }[]>({
        url: this.apiPath,
        data: shifts,
        method: 'POST',
      })
      .then((res) => {
        if (options?.rawResponse) return res;

        const success: Shift[] = [];
        const failed: { id: number; error: string }[] = [];
        for (let shiftIdx = 0; shiftIdx < res.data.length; shiftIdx += 1) {
          const { data, error } = res.data[shiftIdx];
          if (data) success.push(data);
          if (error) failed.push({ id: shifts[shiftIdx].id, error });
        }
        return { success, failed };
      });
  }

  delete(ids: number | number[]): Promise<number>;
  delete(ids: number | number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(ids: number | number[], options: Options): Promise<number>;
  delete(ids: number | number[], options?: Options) {
    const params: AxiosRequestConfig = Array.isArray(ids)
      ? { url: this.apiPath, data: { ids }, method: 'DELETE' }
      : { url: `${this.apiPath}/${ids}`, method: 'DELETE' };

    return super.fetch<Shift>(params).then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  acknowledge(data: number[]): Promise<number>;
  acknowledge(data: number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  acknowledge(data: number[], options: Options): Promise<number>;
  acknowledge(data: number[], options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_acknowledged', data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  publish(data: { shifts: number[] }): Promise<number>;
  publish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  publish(data: { shifts: number[] }, options: Options): Promise<number>;
  publish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_published', data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  unpublish(data: { shifts: number[] }): Promise<number>;
  unpublish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  unpublish(data: { shifts: number[] }, options: Options): Promise<number>;
  unpublish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_published', data, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
