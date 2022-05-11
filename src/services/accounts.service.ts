import { Account } from '../models/account.model.js';
import { Service, Options } from './index.js';

import { ApiAccount } from '../interfaces/index.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';

class AccountsService extends Service {
  private apiPath = '/accounts';

  async *list(options?: Options<InternalQueryParams>) {
    for await (const res of super.iterator<ApiAccount>({ url: this.apiPath }, options)) {
      yield new Account(res);
    }
  }

  listByPage(options?: Options<InternalQueryParams>) {
    return super.iterator<ApiAccount>({ url: this.apiPath }, options).byPage();
  }
}

export { AccountsService };
