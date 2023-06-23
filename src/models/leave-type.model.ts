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
    this.short_name = leaveType.short_name;
    this.colour = leaveType.colour;
    this.can_request = leaveType.can_request;
    this.time_attendance_only = leaveType.time_attendance_only;
  }
}
