import { ApiDailyBudgets } from '../interfaces/index.js';

export class DailyBudgets {
  public date: string;
  public location: number;
  public hours_budget: number;
  public salary_budget: number;

  constructor(dailyBudgets: ApiDailyBudgets) {
    this.date = dailyBudgets.date;
    this.location = dailyBudgets.location;
  }
}
