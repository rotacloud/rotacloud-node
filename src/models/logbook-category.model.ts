import { ApiLogbookCategory } from '../interfaces/index.js';

export class LogbookCategory {
  public id: number;
  public name: string;
  public deleted: boolean;

  constructor(logbookCategory: ApiLogbookCategory) {
    this.id = logbookCategory.id;
    this.name = logbookCategory.name;
  }
}
