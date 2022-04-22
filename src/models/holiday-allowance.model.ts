import { ApiHolidayAllowance } from '../interfaces/index.js';

export class HolidayAllowance {
  public user: number;
  public default_holiday_allowance: number;
  public default_holiday_allowance_unit: string;
  public custom_holiday_allowance: null;
  public custom_holiday_allowance_unit: null;
  public adjusted_start_date: boolean;
  public adjusted_final_working_date: boolean;
  public holiday_allowance: number;
  public holiday_allowance_unit: string;

  constructor(holidayAllowance: ApiHolidayAllowance) {
    this.user = holidayAllowance.user;
  }
}
