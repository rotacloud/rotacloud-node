import { ApiAttendance } from '../interfaces/index.js';

export class Attendance {
  public id: number;
  public approved: boolean;
  public location: number;

  constructor(attendance: ApiAttendance) {
    this.id = attendance.id;
    this.approved = attendance.approved;
    this.location = attendance.location;
  }
}
