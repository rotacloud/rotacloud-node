import { ApiDaysOff, ApiDayOff } from '../interfaces/index.js';

export class DaysOff {
  public user: number;
  public dates: ApiDayOff[];
  constructor(daysoff: ApiDaysOff) {
    this.user = daysoff.user;
    this.dates = daysoff.dates;
  }
}
