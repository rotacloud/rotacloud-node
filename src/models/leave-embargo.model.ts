import { ApiLeaveEmbargo } from '../interfaces/index.js';

export class LeaveEmbargo {
  public id: number;
  public message: string;

  constructor(leaveEmbargo: ApiLeaveEmbargo) {
    this.id = leaveEmbargo.id;
    this.message = leaveEmbargo.message;
  }
}
