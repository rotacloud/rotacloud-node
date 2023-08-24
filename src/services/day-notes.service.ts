import { AxiosResponse } from 'axios';
import { ApiDayNote } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { DayNotesQueryParams } from '../interfaces/query-params/day-notes-query-params.interface';

export class DayNotesService extends Service {
  private apiPath = '/day_notes';

  create(data: ApiDayNote): Promise<ApiDayNote>;
  create(data: ApiDayNote, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiDayNote, any>>;
  create(data: ApiDayNote, options: Options): Promise<ApiDayNote>;
  create(data: ApiDayNote, options?: Options) {
    return super
      .fetch<ApiDayNote>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiDayNote>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiDayNote, any>>;
  get(id: number, options: Options): Promise<ApiDayNote>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiDayNote>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: DayNotesQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiDayNote>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DayNotesQueryParams, options?: Options): Promise<ApiDayNote[]>;
  async listAll(query: DayNotesQueryParams, options?: Options) {
    const dayNotes: ApiDayNote[] = [];
    for await (const dayNote of this.list(query, options)) {
      dayNotes.push(dayNote);
    }
    return dayNotes;
  }

  listByPage(query: DayNotesQueryParams, options?: Options) {
    return super.iterator<ApiDayNote>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiDayNote>): Promise<ApiDayNote>;
  update(
    id: number,
    data: Partial<ApiDayNote>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiDayNote, any>>;
  update(id: number, data: Partial<ApiDayNote>, options: Options): Promise<ApiDayNote>;
  update(id: number, data: Partial<ApiDayNote>, options?: Options) {
    return super
      .fetch<ApiDayNote>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiDayNote>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
