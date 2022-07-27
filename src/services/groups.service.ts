import { AxiosResponse } from 'axios';
import { ApiGroup } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { ErrorResponse } from '../models/error-response.model.js';

import { Group } from '../models/group.model.js';
import { GroupsQueryParams } from '../interfaces/query-params/groups-query-params.interface.js';

type RequiredProps = 'name';

export class GroupsService extends Service {
  private apiPath = '/groups';

  create(data: RequirementsOf<ApiGroup, RequiredProps>): Promise<Group>;
  create(
    data: RequirementsOf<ApiGroup, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiGroup, any>>;
  create(data: RequirementsOf<ApiGroup, RequiredProps>, options: Options): Promise<Group>;
  create(data: RequirementsOf<ApiGroup, RequiredProps>, options?: Options) {
    return super.fetch<ApiGroup>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Group(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Group>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiGroup, any>>;
  get(id: number, options: Options): Promise<Group>;
  get(id: number, options?: Options) {
    return super.fetch<ApiGroup>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Group(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(query: GroupsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiGroup>({ url: this.apiPath, params: query }, options)) {
      yield new Group(res);
    }
  }

  listAll(query: GroupsQueryParams, options?: Options): Promise<Group[]>;
  async listAll(query: GroupsQueryParams, options?: Options) {
    try {
      const groups = [] as Group[];
      for await (const group of this.list(query, options)) {
        groups.push(group);
      }
      return groups;
    } catch (err) {
      return err;
    }
  }

  listByPage(query: GroupsQueryParams, options?: Options) {
    return super.iterator<ApiGroup>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiGroup>): Promise<Group>;
  update(
    id: number,
    data: Partial<ApiGroup>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiGroup, any>>;
  update(id: number, data: Partial<ApiGroup>, options: Options): Promise<Group>;
  update(id: number, data: Partial<ApiGroup>, options?: Options) {
    return super
      .fetch<ApiGroup>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Group(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super.fetch<ApiGroup>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}
