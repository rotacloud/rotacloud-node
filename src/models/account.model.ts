import { ApiAccount } from '../interfaces/index.js';

export class Account {
  public id: number;
  public name: string;
  public level: string;
  public created: number;

  constructor(account: ApiAccount) {
    this.id = account.id;
    this.name = account.name;
    this.level = account.level;
    this.created = account.created;
  }
}
