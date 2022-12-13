import { ApiLeaveDate, ApiLeaveRequest } from '../interfaces';

export class LeaveRequest {
  public id: number;
  public deleted: boolean;
  public type: number;
  public user: number;
  public user_message: string | null;
  public start_date: string;
  public start_am_pm: string;
  public end_date: string;
  public end_am_pm: string;
  public dates: ApiLeaveDate[];

  constructor(leaveRequest: ApiLeaveRequest) {
    this.id = leaveRequest.id;
    this.deleted = leaveRequest.deleted;
    this.type = leaveRequest.type;
    this.user = leaveRequest.user;
    this.user_message = leaveRequest.user_message;
    this.start_date = leaveRequest.start_date;
    this.start_am_pm = leaveRequest.start_am_pm;
    this.end_date = leaveRequest.end_date;
    this.end_am_pm = leaveRequest.end_am_pm;
    this.dates = leaveRequest.dates;
  }
}
