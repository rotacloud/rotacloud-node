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
    this.labour_percentage = dailyRevenue.labour_percentage;
    this.revenue_target = dailyRevenue.revenue_target;
    this.revenue_actual = dailyRevenue.revenue_actual;
  }
}
