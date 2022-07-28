import { ApiAuth, ApiAuthAccount } from '../interfaces/index.js';

export class Auth {
  public two_factor_enabled: boolean;
  public accounts: ApiAuthAccount[];

  constructor(auth: ApiAuth) {
    this.two_factor_enabled = auth.two_factor_enabled;
    this.accounts = auth.accounts;
  }
}
