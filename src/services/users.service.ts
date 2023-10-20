import { AxiosResponse } from 'axios';
import { User } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { UsersQueryParams } from '../interfaces/query-params/users-query-params.interface.js';

type RequiredProps = 'first_name' | 'last_name';

export class UsersService extends Service<User> {
  private apiPath = '/users';

  create(data: RequirementsOf<User, RequiredProps>): Promise<User>;
  create(
    data: RequirementsOf<User, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<User>>;
  create(data: RequirementsOf<User, RequiredProps>, options: Options): Promise<User>;
  create(data: RequirementsOf<User, RequiredProps>, options?: Options) {
    return super
      .fetch<User>({ url: this.apiPath, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<User>;
  get<F extends keyof User>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<User>,
  ): Promise<AxiosResponse<Pick<User, F>>>;
  get<F extends keyof User>(id: number, options: { fields: F[] } & OptionsExtended<User>): Promise<Pick<User, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<User>>;
  get(id: number, options?: OptionsExtended<User>): Promise<User>;
  get(id: number, options?: OptionsExtended<User>) {
    return super
      .fetch<User>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query: UsersQueryParams): AsyncGenerator<User>;
  list<F extends keyof User>(
    query: UsersQueryParams,
    options: { fields: F[] } & OptionsExtended<User>,
  ): AsyncGenerator<Pick<User, F>>;
  list(query: UsersQueryParams, options?: OptionsExtended<User>): AsyncGenerator<User>;
  async *list(query: UsersQueryParams, options?: OptionsExtended<User>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query: UsersQueryParams): Promise<User[]>;
  listAll<F extends keyof User>(
    query: UsersQueryParams,
    options: { fields: F[] } & OptionsExtended<User[]>,
  ): Promise<Pick<User, F>[]>;
  listAll(query: UsersQueryParams, options?: OptionsExtended<User>): Promise<User[]>;
  async listAll(query: UsersQueryParams, options?: OptionsExtended<User>) {
    const users = [] as User[];
    for await (const user of this.list(query, options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(query: UsersQueryParams): AsyncGenerator<AxiosResponse<User[]>>;
  listByPage<F extends keyof User>(
    query: UsersQueryParams,
    options: { fields: F[] } & OptionsExtended<User[]>,
  ): AsyncGenerator<AxiosResponse<Pick<User, F>[]>>;
  listByPage(query: UsersQueryParams, options?: OptionsExtended<User>): AsyncGenerator<AxiosResponse<User[]>>;
  listByPage(query: UsersQueryParams, options?: OptionsExtended<User>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<User>): Promise<User>;
  update(id: number, data: Partial<User>, options: { rawResponse: true } & Options): Promise<AxiosResponse<User, any>>;
  update(id: number, data: Partial<User>, options: Options): Promise<User>;
  update(id: number, data: Partial<User>, options?: Options) {
    return super
      .fetch<User>(
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
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<number>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<number>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
