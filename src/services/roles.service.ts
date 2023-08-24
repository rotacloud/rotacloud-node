import { AxiosResponse } from 'axios';
import { Role } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { RolesQueryParams } from '../interfaces/query-params/roles-query-params.interface.js';

type RequiredProps = 'name';

export class RolesService extends Service {
  private apiPath = '/roles';

  create(data: RequirementsOf<Role, RequiredProps>): Promise<Role>;
  create(
    data: RequirementsOf<Role, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Role, any>>;
  create(data: RequirementsOf<Role, RequiredProps>, options: Options): Promise<Role>;
  create(data: RequirementsOf<Role, RequiredProps>, options?: Options) {
    return super
      .fetch<Role>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Role>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Role, any>>;
  get(id: number, options: Options): Promise<Role>;
  get(id: number, options?: Options) {
    return super
      .fetch<Role>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: RolesQueryParams, options?: Options) {
    for await (const res of super.iterator<Role>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: RolesQueryParams, options?: Options): Promise<Role[]>;
  async listAll(query: RolesQueryParams, options?: Options) {
    const roles = [] as Role[];
    for await (const role of this.list(query, options)) {
      roles.push(role);
    }
    return roles;
  }

  listByPage(query?: RolesQueryParams, options?: Options) {
    return super.iterator<Role>({ url: this.apiPath, params: query }, options).byPage();
  }
  update(id: number, data: Partial<Role>): Promise<Role>;
  update(id: number, data: Partial<Role>, options: { rawResponse: true } & Options): Promise<AxiosResponse<Role, any>>;
  update(id: number, data: Partial<Role>, options: Options): Promise<Role>;
  update(id: number, data: Partial<Role>, options?: Options) {
    return super
      .fetch<Role>({
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
      .fetch<Role>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
