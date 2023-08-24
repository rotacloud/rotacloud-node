import { AxiosResponse } from 'axios';
import { Group } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { GroupsQueryParams } from '../interfaces/query-params/groups-query-params.interface.js';

type RequiredProps = 'name';

export class GroupsService extends Service {
  private apiPath = '/groups';

  create(data: RequirementsOf<Group, RequiredProps>): Promise<Group>;
  create(
    data: RequirementsOf<Group, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Group, any>>;
  create(data: RequirementsOf<Group, RequiredProps>, options: Options): Promise<Group>;
  create(data: RequirementsOf<Group, RequiredProps>, options?: Options) {
    return super
      .fetch<Group>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Group>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Group, any>>;
  get(id: number, options: Options): Promise<Group>;
  get(id: number, options?: Options) {
    return super
      .fetch<Group>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: GroupsQueryParams, options?: Options) {
    for await (const res of super.iterator<Group>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: GroupsQueryParams, options?: Options): Promise<Group[]>;
  async listAll(query: GroupsQueryParams, options?: Options) {
    const groups = [] as Group[];
    for await (const group of this.list(query, options)) {
      groups.push(group);
    }
    return groups;
  }

  listByPage(query?: GroupsQueryParams, options?: Options) {
    return super.iterator<Group>({ url: this.apiPath, params: query }, options).byPage();
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
      .fetch<Group>({
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
      .fetch<Group>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
