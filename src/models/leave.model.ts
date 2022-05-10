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
  public admin_message: string;
  public user_message: string;

  constructor(leave: ApiLeave) {
    this.id = leave.id;
    this.dates = leave.dates;
    this.user = leave.user;
    this.start_date = leave.start_date;
    this.end_date = leave.end_date;
    this.paid = leave.paid;
    this.status = leave.status;
    this.requested = leave.requested;
    this.admin_message = leave.admin_message;
    this.user_message = leave.user_message;
  }
}
