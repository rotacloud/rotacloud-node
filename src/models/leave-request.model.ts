import { ApiLeaveDate, ApiLeaveRequest } from '../interfaces';

export class LeaveRequest {
  public id: number;
  public deleted: boolean;
  public type: number;
  public user: number;
  public user_message: string | null;
  public start_date: string;
  public start_am_pm: null;
  public end_date: string;
  public end_am_pm: null;
  public dates: ApiLeaveDate[];

  constructor(leaveRequest: ApiLeaveRequest) {
    this.id = leaveRequest.id;
  }
}
