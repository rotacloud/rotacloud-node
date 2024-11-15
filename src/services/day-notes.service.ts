import { AxiosResponse } from 'axios';
import { DayNote } from '../interfaces/index.js';
import { Service, Options, OptionsExtended } from './index.js';

import { DayNotesQueryParams } from '../interfaces/query-params/day-notes-query-params.interface.js';

export class DayNotesService extends Service<DayNote> {
  private apiPath = '/day_notes';

  create(data: DayNote): Promise<DayNote>;
  create(data: DayNote, options: { rawResponse: true } & Options): Promise<AxiosResponse<DayNote, any>>;
  create(data: DayNote, options: Options): Promise<DayNote>;
  create(data: DayNote, options?: Options) {
    return super
      .fetch({ url: this.apiPath, data, method: 'POST' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<DayNote>;
  get<F extends keyof DayNote>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<DayNote>,
  ): Promise<AxiosResponse<Pick<DayNote, F>>>;
  get<F extends keyof DayNote>(
    id: number,
    options: { fields: F[] } & OptionsExtended<DayNote>,
  ): Promise<Pick<DayNote, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<DayNote>>;
  get(id: number, options?: OptionsExtended<DayNote>): Promise<DayNote>;
  get(id: number, options?: OptionsExtended<DayNote>) {
    return super
      .fetch<DayNote>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: DayNotesQueryParams): AsyncGenerator<DayNote>;
  list<F extends keyof DayNote>(
    query: DayNotesQueryParams,
    options: { fields: F[] } & OptionsExtended<DayNote>,
  ): AsyncGenerator<Pick<DayNote, F>>;
  list(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>): AsyncGenerator<DayNote>;
  async *list(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: DayNotesQueryParams): Promise<DayNote[]>;
  listAll<F extends keyof DayNote>(
    query: DayNotesQueryParams,
    options: { fields: F[] } & OptionsExtended<DayNote>,
  ): Promise<Pick<DayNote, F>[]>;
  listAll(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>): Promise<DayNote[]>;
  async listAll(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>) {
    const dayNotes: DayNote[] = [];
    for await (const dayNote of this.list(query, options)) {
      dayNotes.push(dayNote);
    }
    return dayNotes;
  }

  listByPage(query: DayNotesQueryParams): AsyncGenerator<AxiosResponse<DayNote[]>>;
  listByPage<F extends keyof DayNote>(
    query: DayNotesQueryParams,
    options: { fields: F[] } & OptionsExtended<DayNote>,
  ): AsyncGenerator<AxiosResponse<Pick<DayNote, F>[]>>;
  listByPage(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>): AsyncGenerator<AxiosResponse<DayNote[]>>;
  listByPage(query: DayNotesQueryParams, options?: OptionsExtended<DayNote>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
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
      .fetch<DayNote>(
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
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
