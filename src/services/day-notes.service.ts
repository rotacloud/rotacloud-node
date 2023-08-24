import { AxiosResponse } from 'axios';
import { DayNote } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { DayNotesQueryParams } from '../interfaces/query-params/day-notes-query-params.interface';

export class DayNotesService extends Service {
  private apiPath = '/day_notes';

  create(data: DayNote): Promise<DayNote>;
  create(data: DayNote, options: { rawResponse: true } & Options): Promise<AxiosResponse<DayNote, any>>;
  create(data: DayNote, options: Options): Promise<DayNote>;
  create(data: DayNote, options?: Options) {
    return super
      .fetch<DayNote>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<DayNote>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<DayNote, any>>;
  get(id: number, options: Options): Promise<DayNote>;
  get(id: number, options?: Options) {
    return super
      .fetch<DayNote>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query: DayNotesQueryParams, options?: Options) {
    for await (const res of super.iterator<DayNote>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: DayNotesQueryParams, options?: Options): Promise<DayNote[]>;
  async listAll(query: DayNotesQueryParams, options?: Options) {
    const dayNotes: DayNote[] = [];
    for await (const dayNote of this.list(query, options)) {
      dayNotes.push(dayNote);
    }
    return dayNotes;
  }

  listByPage(query: DayNotesQueryParams, options?: Options) {
    return super.iterator<DayNote>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<DayNote>): Promise<DayNote>;
  update(
    id: number,
    data: Partial<DayNote>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<DayNote, any>>;
  update(id: number, data: Partial<DayNote>, options: Options): Promise<DayNote>;
  update(id: number, data: Partial<DayNote>, options?: Options) {
    return super
      .fetch<DayNote>({
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
      .fetch<DayNote>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
