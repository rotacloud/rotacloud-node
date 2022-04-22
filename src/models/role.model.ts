import { ApiRole } from '../interfaces/index.js';

export class Role {
  public id: number;
  public name: string;
  public colour: string;
  constructor(role: ApiRole) {
    this.id = role.id;
    this.name = role.name;
  }
}
