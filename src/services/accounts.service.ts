import { AxiosResponse } from 'axios';
import { Service, Options, OptionsExtended } from './index.js';

import { Account } from '../interfaces/index.js';

export class AccountsService extends Service<Account> {
  private apiPath = '/accounts';

  get(id: number): Promise<Account>;
  get<F extends keyof Account>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Account>,
  ): Promise<AxiosResponse<Pick<Account, F>>>;
  get<F extends keyof Account>(
    id: number,
    options: { fields: F[] } & OptionsExtended<Account>,
  ): Promise<Pick<Account, F>>;
  get(id: number, options: { rawResponse: true } & OptionsExtended<Account>): Promise<AxiosResponse<Account>>;
  get(id: number, options?: OptionsExtended<Account>): Promise<Account>;
  get(id: number, options?: OptionsExtended<Account>) {
    return super
      .fetch<Account>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(): AsyncGenerator<Account>;
  list<F extends keyof Account>(options: { fields: F[] } & OptionsExtended<Account>): AsyncGenerator<Pick<Account, F>>;
  list(options?: OptionsExtended<Account>): AsyncGenerator<Account>;
  async *list(options?: OptionsExtended<Account>) {
    yield* super.iterator({ url: this.apiPath }, options);
  }

  listAll(): Promise<Account[]>;
  listAll<F extends keyof Account>(options: { fields: F[] } & OptionsExtended<Account>): Promise<Pick<Account, F>[]>;
  listAll(options?: OptionsExtended<Account>): Promise<Account[]>;
  async listAll(options?: OptionsExtended<Account>) {
    const accounts = [] as Account[];
    for await (const account of this.list(options)) {
      accounts.push(account);
    }
    return accounts;
  }

  listByPage(): AsyncGenerator<AxiosResponse<Account[]>>;
  listByPage<F extends keyof Account>(
    options: { fields: F[] } & OptionsExtended<Account>,
  ): AsyncGenerator<AxiosResponse<Pick<Account, F>[]>>;
  listByPage(options: OptionsExtended<Account>): AsyncGenerator<AxiosResponse<Account[]>>;
  listByPage(options?: Options) {
    return super.iterator({ url: this.apiPath }, options).byPage();
  }
}
