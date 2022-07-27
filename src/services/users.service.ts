import { AxiosResponse } from 'axios';
import { ApiUser } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { User } from '../models/user.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { UsersQueryParams } from '../interfaces/query-params/users-query-params.interface.js';

type RequiredProps = 'first_name' | 'last_name';

class UsersService extends Service {
  private apiPath = '/users';

  create(data: RequirementsOf<ApiUser, RequiredProps>): Promise<User>;
  create(
    data: RequirementsOf<ApiUser, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUser, any>>;
  create(data: RequirementsOf<ApiUser, RequiredProps>, options: Options): Promise<User>;
  create(data: RequirementsOf<ApiUser, RequiredProps>, options?: Options) {
    return super.fetch<ApiUser>({ url: this.apiPath, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new User(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<User>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiUser, any>>;
  get(id: number, options: Options): Promise<User>;
  get(id: number, options?: Options) {
    return super.fetch<ApiUser>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new User(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(query: UsersQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiUser>({ url: this.apiPath, params: query }, options)) {
      yield new User(res);
    }
  }

  listAll(query: UsersQueryParams, options?: Options): Promise<User[]>;
  async listAll(query: UsersQueryParams, options?: Options) {
    try {
      const users = [] as User[];
      for await (const user of this.list(query, options)) {
        users.push(user);
      }
      return users;
    } catch (err) {
      return err;
    }
  }

  listByPage(query: UsersQueryParams, options?: Options) {
    return super.iterator<ApiUser>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiUser>): Promise<User>;
  update(
    id: number,
    data: Partial<ApiUser>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUser, any>>;
  update(id: number, data: Partial<ApiUser>, options: Options): Promise<User>;
  update(id: number, data: Partial<ApiUser>, options?: Options) {
    return super
      .fetch<ApiUser>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new User(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super.fetch<ApiUser>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { UsersService };
