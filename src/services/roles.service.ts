import { AxiosResponse } from 'axios';
import { Role } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { RolesQueryParams } from '../interfaces/query-params/roles-query-params.interface.js';

type RequiredProps = 'name';

export class RolesService extends Service<Role> {
  private apiPath = '/roles';

  create(data: RequirementsOf<Role, RequiredProps>): Promise<Role>;
  create(
    data: RequirementsOf<Role, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Role, any>>;
  create(data: RequirementsOf<Role, RequiredProps>, options: Options): Promise<Role>;
  create(data: RequirementsOf<Role, RequiredProps>, options?: Options) {
    return super
      .fetch<Role>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Role>;
  get<F extends keyof Role>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Role>,
  ): Promise<AxiosResponse<Pick<Role, F>>>;
  get<F extends keyof Role>(id: number, options: { fields: F[] } & OptionsExtended<Role>): Promise<Pick<Role, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Role>>;
  get(id: number, options?: OptionsExtended<Role>): Promise<Role>;
  get(id: number, options?: OptionsExtended<Role>) {
    return super
      .fetch<Role>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: RolesQueryParams): AsyncGenerator<Role>;
  list<F extends keyof Role>(
    query: RolesQueryParams,
    options: { fields: F[] } & OptionsExtended<Role>,
  ): AsyncGenerator<Pick<Role, F>>;
  list(query: RolesQueryParams, options?: OptionsExtended<Role>): AsyncGenerator<Role>;
  async *list(query?: RolesQueryParams, options?: OptionsExtended<Role>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: RolesQueryParams): Promise<Role[]>;
  listAll<F extends keyof Role>(
    query: RolesQueryParams,
    options: { fields: F[] } & OptionsExtended<Role>,
  ): Promise<Pick<Role, F>[]>;
  listAll(query: RolesQueryParams, options?: OptionsExtended<Role>): Promise<Role[]>;
  async listAll(query: RolesQueryParams, options?: OptionsExtended<Role>) {
    const roles = [] as Role[];
    for await (const role of this.list(query, options)) {
      roles.push(role);
    }
    return roles;
  }

  listByPage(query: RolesQueryParams): AsyncGenerator<AxiosResponse<Role[]>>;
  listByPage<F extends keyof Role>(
    query: RolesQueryParams,
    options: { fields: F[] } & OptionsExtended<Role>,
  ): AsyncGenerator<AxiosResponse<Pick<Role, F>[]>>;
  listByPage(query: RolesQueryParams, options?: OptionsExtended<Role>): AsyncGenerator<AxiosResponse<Role[]>>;
  listByPage(query?: RolesQueryParams, options?: OptionsExtended<Role>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Role>): Promise<Role>;
  update(id: number, data: Partial<Role>, options: { rawResponse: true } & Options): Promise<AxiosResponse<Role, any>>;
  update(id: number, data: Partial<Role>, options: Options): Promise<Role>;
  update(id: number, data: Partial<Role>, options?: Options) {
    return super
      .fetch<Role>(
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
