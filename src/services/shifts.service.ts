import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Shift } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { ShiftsQueryParams } from '../interfaces/query-params/shifts-query-params.interface.js';

type RequiredProps = 'end_time' | 'start_time' | 'location';

export class ShiftsService extends Service<Shift> {
  private apiPath = '/shifts';

  create(data: RequirementsOf<Shift, RequiredProps>): Promise<Shift>;
  create(
    data: RequirementsOf<Shift, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Shift, any>>;
  create(data: RequirementsOf<Shift, RequiredProps>, options: Options): Promise<Shift>;
  create(data: RequirementsOf<Shift, RequiredProps>, options?: Options) {
    return super
      .fetch<Shift>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Shift>;
  get<F extends keyof Shift>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Shift>,
  ): Promise<AxiosResponse<Pick<Shift, F>>>;
  get<F extends keyof Shift>(id: number, options: { fields: F[] } & OptionsExtended<Shift>): Promise<Pick<Shift, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Shift>>;
  get(id: number, options?: OptionsExtended<Shift>): Promise<Shift>;
  get(id: number, options?: OptionsExtended<Shift>) {
    return super
      .fetch<Shift>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: ShiftsQueryParams): AsyncGenerator<Shift>;
  list<F extends keyof Shift>(
    query: ShiftsQueryParams,
    options: { fields: F[] } & OptionsExtended<Shift>,
  ): AsyncGenerator<Pick<Shift, F>>;
  list(query: ShiftsQueryParams, options?: OptionsExtended<Shift>): AsyncGenerator<Shift>;
  async *list(query: ShiftsQueryParams, options?: OptionsExtended<Shift>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: ShiftsQueryParams): Promise<Shift[]>;
  listAll<F extends keyof Shift>(
    query: ShiftsQueryParams,
    options: { fields: F[] } & OptionsExtended<Shift>,
  ): Promise<Pick<Shift, F>[]>;
  listAll(query: ShiftsQueryParams, options?: OptionsExtended<Shift>): Promise<Shift[]>;
  async listAll(query: ShiftsQueryParams, options?: OptionsExtended<Shift>) {
    const shifts = [] as Shift[];
    for await (const shift of this.list(query, options)) {
      shifts.push(shift);
    }
    return shifts;
  }

  listByPage(query: ShiftsQueryParams): AsyncGenerator<AxiosResponse<Shift[]>>;
  listByPage<F extends keyof Shift>(
    query: ShiftsQueryParams,
    options: { fields: F[] } & OptionsExtended<Shift>,
  ): AsyncGenerator<AxiosResponse<Pick<Shift, F>[]>>;
  listByPage(query: ShiftsQueryParams, options?: OptionsExtended<Shift>): AsyncGenerator<AxiosResponse<Shift[]>>;
  listByPage(query: ShiftsQueryParams, options?: OptionsExtended<Shift>) {
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
        .fetch<Shift>(
          {
            url: `${this.apiPath}/${shifts.id}`,
            data: shifts,
            method: 'POST',
          },
          options,
        )
        .then((res) => (options?.rawResponse ? res : res.data));
    }

    return super
      .fetch<{ code: number; data?: Shift; error?: string }[]>(
        {
          url: this.apiPath,
          data: shifts,
          method: 'POST',
        },
        options,
      )
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
  delete(ids: number | number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(ids: number | number[], options: Options): Promise<number>;
  delete(ids: number | number[], options?: Options) {
    const params: AxiosRequestConfig = Array.isArray(ids)
      ? { url: this.apiPath, data: { ids }, method: 'DELETE' }
      : { url: `${this.apiPath}/${ids}`, method: 'DELETE' };

    return super.fetch<void>(params, options).then((res) => (options?.rawResponse ? res : res.status));
  }

  acknowledge(data: number[]): Promise<number>;
  acknowledge(data: number[], options: { rawResponse: true } & Options): Promise<AxiosResponse<any>>;
  acknowledge(data: number[], options: Options): Promise<number>;
  acknowledge(data: number[], options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_acknowledged', data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }

  publish(data: { shifts: number[] }): Promise<number>;
  publish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any>>;
  publish(data: { shifts: number[] }, options: Options): Promise<number>;
  publish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_published', data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }

  unpublish(data: { shifts: number[] }): Promise<number>;
  unpublish(data: { shifts: number[] }, options: { rawResponse: true } & Options): Promise<AxiosResponse<any>>;
  unpublish(data: { shifts: number[] }, options: Options): Promise<number>;
  unpublish(data: { shifts: number[] }, options?: Options) {
    return super
      .fetch<Shift>({ url: '/shifts_published', data, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
