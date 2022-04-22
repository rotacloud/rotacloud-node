import { ApiDaysOffPattern } from '../interfaces/index.js';

export class DaysOffPattern {
  public id: number;
  public user: number;
  public start_date: string;
  public end_date: string;
  public mon_day_off: boolean;
  public tue_day_off: boolean;
  public wed_day_off: boolean;
  public thu_day_off: boolean;
  public fri_day_off: boolean;
  public sat_day_off: boolean;
  public sun_day_off: boolean;

  constructor(daysOffPattern: ApiDaysOffPattern) {
    this.id = daysOffPattern.id;
  }
}
