import { AxiosResponse } from 'axios';
import { Group } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { GroupsQueryParams } from '../interfaces/query-params/groups-query-params.interface.js';

type RequiredProps = 'name';

export class GroupsService extends Service<Group> {
  private apiPath = '/groups';

  create(data: RequirementsOf<Group, RequiredProps>): Promise<Group>;
  create(
    data: RequirementsOf<Group, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Group, any>>;
  create(data: RequirementsOf<Group, RequiredProps>, options: Options): Promise<Group>;
  create(data: RequirementsOf<Group, RequiredProps>, options?: Options) {
    return super
      .fetch({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Group>;
  get<F extends keyof Group>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Group>,
  ): Promise<AxiosResponse<Pick<Group, F>>>;
  get<F extends keyof Group>(id: number, options: { fields: F[] } & OptionsExtended<Group>): Promise<Pick<Group, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Group>>;
  get(id: number, options?: OptionsExtended<Group>): Promise<Group>;
  get(id: number, options?: OptionsExtended<Group>) {
    return super
      .fetch<Group>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: GroupsQueryParams): AsyncGenerator<Group>;
  list<F extends keyof Group>(
    query: GroupsQueryParams,
    options: { fields: F[] } & OptionsExtended<Group>,
  ): AsyncGenerator<Pick<Group, F>>;
  list(query: GroupsQueryParams, options?: OptionsExtended<Group>): AsyncGenerator<Group>;
  async *list(query?: GroupsQueryParams, options?: OptionsExtended<Group>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: GroupsQueryParams): Promise<Group[]>;
  listAll<F extends keyof Group>(
    query: GroupsQueryParams,
    options: { fields: F[] } & OptionsExtended<Group>,
  ): Promise<Pick<Group, F>[]>;
  listAll(query: GroupsQueryParams, options?: OptionsExtended<Group>): Promise<Group[]>;
  async listAll(query: GroupsQueryParams, options?: OptionsExtended<Group>) {
    const groups = [] as Group[];
    for await (const group of this.list(query, options)) {
      groups.push(group);
    }
    return groups;
  }

  listByPage(query: GroupsQueryParams): AsyncGenerator<AxiosResponse<Group[]>>;
  listByPage<F extends keyof Group>(
    query: GroupsQueryParams,
    options: { fields: F[] } & OptionsExtended<Group>,
  ): AsyncGenerator<AxiosResponse<Pick<Group, F>[]>>;
  listByPage(query: GroupsQueryParams, options?: OptionsExtended<Group>): AsyncGenerator<AxiosResponse<Group[]>>;
  listByPage(query?: GroupsQueryParams, options?: OptionsExtended<Group>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Group>): Promise<Group>;
  update(
    id: number,
    data: Partial<Group>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Group, any>>;
  update(id: number, data: Partial<Group>, options: Options): Promise<Group>;
  update(id: number, data: Partial<Group>, options?: Options) {
    return super
      .fetch({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
