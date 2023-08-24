import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { ApiAccount } from '../interfaces/index.js';

export class AccountsService extends Service {
  private apiPath = '/accounts';

  get(id: number): Promise<ApiAccount>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAccount, any>>;
  get(id: number, options: Options): Promise<ApiAccount>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiAccount>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<ApiAccount>({ url: this.apiPath }, options)) {
      yield res;
    }
  }

  listAll(options?: Options): Promise<ApiAccount[]>;
  async listAll(options?: Options) {
    const accounts = [] as ApiAccount[];
    for await (const account of this.list(options)) {
      accounts.push(account);
    }
    return accounts;
  }

  listByPage(options?: Options) {
    return super.iterator<ApiAccount>({ url: this.apiPath }, options).byPage();
  }
}
