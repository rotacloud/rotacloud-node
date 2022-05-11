import { ApiGroup } from '../interfaces/index.js';

export class Group {
  public id: number;
  public name: string;
  public users: number[];

  constructor(group: ApiGroup) {
    this.id = group.id;
    this.name = group.name;
    this.users = group.users;
  }
}
