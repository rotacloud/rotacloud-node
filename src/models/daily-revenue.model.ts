import { ApiDailyRevenue } from '../interfaces/index.js';

export class DailyRevenue {
  public date: string;
  public location: number;
  public labour_percentage: number;
  public revenue_target: number;
  public revenue_actual: number;

  constructor(dailyRevenue: ApiDailyRevenue) {
    this.date = dailyRevenue.date;
    this.location = dailyRevenue.location;
  }
}
