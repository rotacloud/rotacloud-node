import { AxiosResponse } from 'axios';
import { LeaveEmbargo } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { LeaveEmbargoesQueryParams } from '../rotacloud.js';

type RequiredProps = 'start_date' | 'end_date' | 'users';

export class LeaveEmbargoesService extends Service<LeaveEmbargo> {
  private apiPath = '/leave_embargoes';

  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>): Promise<LeaveEmbargo>;
  create(
    data: RequirementsOf<LeaveEmbargo, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveEmbargo, any>>;
  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>, options: Options): Promise<LeaveEmbargo>;
  create(data: RequirementsOf<LeaveEmbargo, RequiredProps>, options?: Options) {
    return super
      .fetch<LeaveEmbargo>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<LeaveEmbargo>;
  get<F extends keyof LeaveEmbargo>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<LeaveEmbargo>,
  ): Promise<AxiosResponse<Pick<LeaveEmbargo, F>>>;
  get<F extends keyof LeaveEmbargo>(
    id: number,
    options: { fields: F[] } & OptionsExtended<LeaveEmbargo>,
  ): Promise<Pick<LeaveEmbargo, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<LeaveEmbargo>>;
  get(id: number, options?: OptionsExtended<LeaveEmbargo>): Promise<LeaveEmbargo>;
  get(id: number, options?: OptionsExtended<LeaveEmbargo>) {
    return super
      .fetch<LeaveEmbargo>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: LeaveEmbargoesQueryParams): AsyncGenerator<LeaveEmbargo>;
  list<F extends keyof LeaveEmbargo>(
    query: LeaveEmbargoesQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveEmbargo>,
  ): AsyncGenerator<Pick<LeaveEmbargo, F>>;
  list(query: LeaveEmbargoesQueryParams, options?: OptionsExtended<LeaveEmbargo>): AsyncGenerator<LeaveEmbargo>;
  async *list(query: LeaveEmbargoesQueryParams, options?: OptionsExtended<LeaveEmbargo>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: LeaveEmbargoesQueryParams): Promise<LeaveEmbargo[]>;
  listAll<F extends keyof LeaveEmbargo>(
    query: LeaveEmbargoesQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveEmbargo>,
  ): Promise<Pick<LeaveEmbargo, F>[]>;
  listAll(query: LeaveEmbargoesQueryParams, options?: OptionsExtended<LeaveEmbargo>): Promise<LeaveEmbargo[]>;
  async listAll(query: LeaveEmbargoesQueryParams, options?: OptionsExtended<LeaveEmbargo>) {
    const leave = [] as LeaveEmbargo[];
    for await (const leaveEmbargoRecord of this.list(query, options)) {
      leave.push(leaveEmbargoRecord);
    }
    return leave;
  }

  listByPage(query: LeaveEmbargoesQueryParams): AsyncGenerator<AxiosResponse<LeaveEmbargo[]>>;
  listByPage<F extends keyof LeaveEmbargo>(
    query: LeaveEmbargoesQueryParams,
    options: { fields: F[] } & OptionsExtended<LeaveEmbargo>,
  ): AsyncGenerator<AxiosResponse<Pick<LeaveEmbargo, F>[]>>;
  listByPage(
    query: LeaveEmbargoesQueryParams,
    options?: OptionsExtended<LeaveEmbargo>,
  ): AsyncGenerator<AxiosResponse<LeaveEmbargo[]>>;
  listByPage(query: LeaveEmbargoesQueryParams, options?: OptionsExtended<LeaveEmbargo>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<LeaveEmbargo>): Promise<LeaveEmbargo>;
  update(
    id: number,
    data: Partial<LeaveEmbargo>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<LeaveEmbargo, any>>;
  update(id: number, data: Partial<LeaveEmbargo>, options: Options): Promise<LeaveEmbargo>;
  update(id: number, data: Partial<LeaveEmbargo>, options?: Options) {
    return super
      .fetch<LeaveEmbargo>(
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
