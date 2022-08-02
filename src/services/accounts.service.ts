import { AxiosResponse } from 'axios';
import { Account } from '../models/account.model.js';
import { Service, Options } from './index.js';

import { ApiAccount } from '../interfaces/index.js';
import { ErrorResponse } from '../models/error-response.model.js';

class AccountsService extends Service {
  private apiPath = '/accounts';

  get(id: number): Promise<Account>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiAccount, any>>;
  get(id: number, options: Options): Promise<Account>;
  get(id: number, options?: Options) {
    return super.fetch<ApiAccount>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Account(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<ApiAccount>({ url: this.apiPath }, options)) {
      yield new Account(res);
    }
  }

  listAll(options?: Options): Promise<Account[]>;
  async listAll(options?: Options) {
    try {
      const accounts = [] as Account[];
      for await (const account of this.list(options)) {
        accounts.push(account);
      }
      return accounts;
    } catch (err) {
      return err;
    }
  }

  listByPage(options?: Options) {
    return super.iterator<ApiAccount>({ url: this.apiPath }, options).byPage();
  }
}

export { AccountsService };
