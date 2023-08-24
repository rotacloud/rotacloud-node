import { AxiosResponse } from 'axios';
import { ApiGroup } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { GroupsQueryParams } from '../interfaces/query-params/groups-query-params.interface.js';

type RequiredProps = 'name';

export class GroupsService extends Service {
  private apiPath = '/groups';

  create(data: RequirementsOf<ApiGroup, RequiredProps>): Promise<ApiGroup>;
  create(
    data: RequirementsOf<ApiGroup, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiGroup, any>>;
  create(data: RequirementsOf<ApiGroup, RequiredProps>, options: Options): Promise<ApiGroup>;
  create(data: RequirementsOf<ApiGroup, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiGroup>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiGroup>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiGroup, any>>;
  get(id: number, options: Options): Promise<ApiGroup>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiGroup>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: GroupsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiGroup>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: GroupsQueryParams, options?: Options): Promise<ApiGroup[]>;
  async listAll(query: GroupsQueryParams, options?: Options) {
    const groups = [] as ApiGroup[];
    for await (const group of this.list(query, options)) {
      groups.push(group);
    }
    return groups;
  }

  listByPage(query?: GroupsQueryParams, options?: Options) {
    return super.iterator<ApiGroup>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiGroup>): Promise<ApiGroup>;
  update(
    id: number,
    data: Partial<ApiGroup>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiGroup, any>>;
  update(id: number, data: Partial<ApiGroup>, options: Options): Promise<ApiGroup>;
  update(id: number, data: Partial<ApiGroup>, options?: Options) {
    return super
      .fetch<ApiGroup>({
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
      .fetch<ApiGroup>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
