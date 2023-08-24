import { AxiosResponse } from 'axios';
import { ApiRole } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { RolesQueryParams } from '../interfaces/query-params/roles-query-params.interface.js';

type RequiredProps = 'name';

export class RolesService extends Service {
  private apiPath = '/roles';

  create(data: RequirementsOf<ApiRole, RequiredProps>): Promise<ApiRole>;
  create(
    data: RequirementsOf<ApiRole, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiRole, any>>;
  create(data: RequirementsOf<ApiRole, RequiredProps>, options: Options): Promise<ApiRole>;
  create(data: RequirementsOf<ApiRole, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiRole>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiRole>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiRole, any>>;
  get(id: number, options: Options): Promise<ApiRole>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiRole>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: RolesQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiRole>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: RolesQueryParams, options?: Options): Promise<ApiRole[]>;
  async listAll(query: RolesQueryParams, options?: Options) {
    const roles = [] as ApiRole[];
    for await (const role of this.list(query, options)) {
      roles.push(role);
    }
    return roles;
  }

  listByPage(query?: RolesQueryParams, options?: Options) {
    return super.iterator<ApiRole>({ url: this.apiPath, params: query }, options).byPage();
  }
  update(id: number, data: Partial<ApiRole>): Promise<ApiRole>;
  update(
    id: number,
    data: Partial<ApiRole>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiRole, any>>;
  update(id: number, data: Partial<ApiRole>, options: Options): Promise<ApiRole>;
  update(id: number, data: Partial<ApiRole>, options?: Options) {
    return super
      .fetch<ApiRole>({
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
      .fetch<ApiRole>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
