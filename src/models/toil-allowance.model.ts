import { ApiToilAllowance } from '../interfaces/toil-allowance.interface';

export class ToilAllowance {
  public user: number;
  public accrued_hours: number;
  public remaining_hours: number;
  public used_hours: number;
  public has_toil_records: boolean;
  constructor(allowance: ApiToilAllowance) {
    this.user = allowance.user;
    this.accrued_hours = allowance.accrued_hours;
    this.remaining_hours = allowance.accrued_hours;
    this.used_hours = allowance.used_hours;
    this.has_toil_records = allowance.has_toil_records;
  }
}
