import { ApiUserClockedOut } from '../interfaces/index.js';

export class UserClockedOut {
  public id: number;
  public deleted: boolean;
  public approved: boolean;
  public user: number;
  public location: number | null;
  public role: number;
  public in_time: number;
  public out_time: number;
  public minutes_break: number;
  public minutes_late: number;
  public hours: number;
  public hours_auto: number;
  public hours_is_auto: number;
  public notes: null; // ?
  public shift: any;
  public in_method: string;
  public in_location: any; // ?
  public in_device: null; // ?
  public in_terminal: null; // ?
  public out_method: string;
  public out_location: any; // ?
  public out_device: null; // ?
  public out_terminal: null; // ?

  constructor(apiUserClockedOut: ApiUserClockedOut) {
    this.id = apiUserClockedOut.id;
    this.deleted = apiUserClockedOut.deleted;
    this.approved = apiUserClockedOut.approved;
    this.user = apiUserClockedOut.user;
    this.location = apiUserClockedOut.location;
    this.role = apiUserClockedOut.role;
    this.in_time = apiUserClockedOut.in_time;
    this.out_time = apiUserClockedOut.out_time;
    this.minutes_break = apiUserClockedOut.minutes_break;
    this.minutes_late = apiUserClockedOut.minutes_late;
  }
}
