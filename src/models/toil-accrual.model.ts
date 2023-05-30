import { ApiToilAccrual } from '../interfaces/toil-accrual.interface';

export class ToilAccrual {
  public comments: string;
  public created_at: number;
  public created_by: number;
  public date: string;
  public deleted: boolean;
  public deleted_at: string | null;
  public deleted_by: string | null;
  public duration_hours: number;
  public id: number;
  public leave_year: number;
  public location_id: number;
  public user_id: number;
  constructor(accrual: ApiToilAccrual) {
    this.comments = accrual.comments;
    this.created_at = accrual.created_at;
    this.created_by = accrual.created_by;
    this.date = accrual.date;
    this.deleted = accrual.deleted;
    this.deleted_at = accrual.deleted_at;
    this.deleted_by = accrual.deleted_by;
    this.duration_hours = accrual.duration_hours;
    this.id = accrual.id;
    this.leave_year = accrual.leave_year;
    this.location_id = accrual.location_id;
    this.user_id = accrual.user_id;
  }
}
