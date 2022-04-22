import { ApiLeave, ApiLeaveDate } from '../interfaces/index.js';

export class Leave {
  public id: number;
  public dates: ApiLeaveDate[];

  constructor(leave: ApiLeave) {
    this.id = leave.id;
    this.dates = leave.dates;
  }
}
