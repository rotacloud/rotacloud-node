import { ApiLeaveType } from '../interfaces/index.js';

export class LeaveType {
  public id: number;
  public name: string;
  public short_name: string;
  public colour: string;
  public can_request: boolean;
  public time_attendance_only: boolean;

  constructor(leaveType: ApiLeaveType) {
    this.id = leaveType.id;
    this.name = leaveType.name;
  }
}
