import { ApiLeave, ApiLeaveDate } from '../interfaces/index.js';

export class Leave {
  public id: number;
  public type: number;
  public user: number;
  public start_date: string;
  public end_date: string;
  public dates: ApiLeaveDate[];
  public paid: boolean;
  public status: string;
  public requested: boolean;
  public admin_message: string | null;
  public user_message: string | null;
  public deleted: boolean;
  public deleted_at: number | null;
  public deleted_by: number | null;
  public admin: number;
  public start_am_pm: string;
  public end_am_pm: string;
  public hours: { [key: string]: number };
  public hours_method: string;
  public hours_set: boolean;
  public requested_at: number;
  public replied_at: number;

  constructor(leave: ApiLeave) {
    this.id = leave.id;
    this.type = leave.type;
    this.dates = leave.dates;
    this.user = leave.user;
    this.start_date = leave.start_date;
    this.end_date = leave.end_date;
    this.paid = leave.paid;
    this.status = leave.status;
    this.requested = leave.requested;
    this.admin_message = leave.admin_message;
    this.user_message = leave.user_message;
    this.deleted = leave.deleted;
    this.deleted_at = leave.deleted_at;
    this.deleted_by = leave.deleted_by;
    this.admin = leave.admin;
    this.start_am_pm = leave.start_am_pm;
    this.end_am_pm = leave.end_am_pm;
    this.hours = leave.hours;
    this.hours_method = leave.hours_method;
    this.hours_set = leave.hours_set;
    this.requested_at = leave.requested_at;
    this.replied_at = leave.replied_at;
  }
}
