import { Account } from '../models/account.model.js';
import { Service, Options } from './index.js';

import { ApiAccount } from '../interfaces/index.js';

class AccountsService extends Service {
  private apiPath = '/accounts';

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
