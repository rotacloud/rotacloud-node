import { ApiRole } from '../interfaces/index.js';

export class Role {
  public id: number;
  public deleted: boolean;
  public name: string;
  public colour: string;
  public default_break: number;
  public users: number[];
  public pay_code: string;

  constructor(role: ApiRole) {
    this.id = role.id;
    this.deleted = role.deleted;
    this.name = role.name;
    this.colour = role.colour;
    this.default_break = role.default_break;
    this.users = role.users;
    this.pay_code = role.pay_code;
  }
}
