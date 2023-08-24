import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { Account } from '../interfaces/index.js';

export class AccountsService extends Service {
  private apiPath = '/accounts';

  get(id: number): Promise<Account>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Account, any>>;
  get(id: number, options: Options): Promise<Account>;
  get(id: number, options?: Options) {
    return super
      .fetch<Account>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<Account>({ url: this.apiPath }, options)) {
      yield res;
    }
  }

  listAll(options?: Options): Promise<Account[]>;
  async listAll(options?: Options) {
    const accounts = [] as Account[];
    for await (const account of this.list(options)) {
      accounts.push(account);
    }
    return accounts;
  }

  listByPage(options?: Options) {
    return super.iterator<Account>({ url: this.apiPath }, options).byPage();
  }
}
