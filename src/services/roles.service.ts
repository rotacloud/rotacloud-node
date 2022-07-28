import { AxiosResponse } from 'axios';
import { ApiRole } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Role } from '../models/role.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { RolesQueryParams } from '../interfaces/query-params/roles-query-params.interface.js';

type RequiredProps = 'name';

export class RolesService extends Service {
  private apiPath = '/roles';

  create(data: RequirementsOf<ApiRole, RequiredProps>): Promise<Role>;
  create(
    data: RequirementsOf<ApiRole, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiRole, any>>;
  create(data: RequirementsOf<ApiRole, RequiredProps>, options: Options): Promise<Role>;
  create(data: RequirementsOf<ApiRole, RequiredProps>, options?: Options) {
    return super.fetch<ApiRole>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Role(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Role>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiRole, any>>;
  get(id: number, options: Options): Promise<Role>;
  get(id: number, options?: Options) {
    return super.fetch<ApiRole>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Role(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(query: RolesQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiRole>({ url: this.apiPath, params: query }, options)) {
      yield new Role(res);
    }
  }

  listAll(query: RolesQueryParams, options?: Options): Promise<Role[]>;
  async listAll(query: RolesQueryParams, options?: Options) {
    try {
      const roles = [] as Role[];
      for await (const role of this.list(query, options)) {
        roles.push(role);
      }
      return roles;
    } catch (err) {
      return err;
    }
  }

  listByPage(query: RolesQueryParams, options?: Options) {
    return super.iterator<ApiRole>({ url: this.apiPath, params: query }, options).byPage();
  }
  update(id: number, data: Partial<ApiRole>): Promise<Role>;
  update(
    id: number,
    data: Partial<ApiRole>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiRole, any>>;
  update(id: number, data: Partial<ApiRole>, options: Options): Promise<Role>;
  update(id: number, data: Partial<ApiRole>, options?: Options) {
    return super
      .fetch<ApiRole>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Role(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super.fetch<ApiRole>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}
