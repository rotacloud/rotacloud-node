import { AxiosResponse } from 'axios';
import { User } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { UsersQueryParams } from '../interfaces/query-params/users-query-params.interface.js';

type RequiredProps = 'first_name' | 'last_name';

export class UsersService extends Service<User> {
  private apiPath = '/users';

  create(data: RequirementsOf<User, RequiredProps>): Promise<User>;
  create(
    data: RequirementsOf<User, RequiredProps>,
    options: { rawResponse: true } & Options<User>,
  ): Promise<AxiosResponse<User, any>>;
  create(data: RequirementsOf<User, RequiredProps>, options: Options<User>): Promise<User>;
  create(data: RequirementsOf<User, RequiredProps>, options?: Options<User>) {
    return super
      .fetch({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<User>;
  get<F extends keyof User>(
    id: number,
    options: { fields: F[]; rawResponse: true } & Options<User>,
  ): Promise<AxiosResponse<Pick<User, F>>>;
  get<F extends keyof User>(id: number, options: { fields: F[] } & Options<User>): Promise<Pick<User, F>>;
  get(id: number, options: { rawResponse: true } & Options<User>): Promise<AxiosResponse<User>>;
  get(id: number, options?: Options<User>): Promise<User>;
  async get(id: number, options?: Options<User>) {
    return super
      .fetch<User>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  async *list(query: UsersQueryParams, options?: Options<User>) {
    for await (const res of super.iterator<User>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query: UsersQueryParams, options?: Options<User>): Promise<User[]>;
  async listAll(query: UsersQueryParams, options?: Options<User>) {
    const users = [] as User[];
    for await (const user of this.list(query, options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(query: UsersQueryParams, options?: Options<User>) {
    return super.iterator<User>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<User>): Promise<User>;
  update(
    id: number,
    data: Partial<User>,
    options: { rawResponse: true } & Options<User>,
  ): Promise<AxiosResponse<User, any>>;
  update(id: number, data: Partial<User>, options: Options<User>): Promise<User>;
  update(id: number, data: Partial<User>, options?: Options<User>) {
    return super
      .fetch({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options<User>): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options<User>): Promise<number>;
  delete(id: number, options?: Options<User>) {
    return super
      .fetch({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
