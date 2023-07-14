import { ApiShift, ApiTerminalLocation, ApiUserClockedOut } from '../interfaces/index.js';

export class UserClockedOut {
  public id: number;
  public deleted: boolean;
  public approved: boolean;
  public user: number;
  public location: any; // todo
  public role: number;
  public in_time: number;
  public out_time: number;
  public minutes_break: number;
  public minutes_late: number;
  public hours: number;
  public hours_auto: number;
  public hours_is_auto: number;
  public notes: string | null;
  public shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  public in_method: string;
  public in_location: ApiTerminalLocation;
  public in_device: any | null; // todo
  public in_terminal: any | null; // todo
  public out_method: string;
  public out_location: ApiTerminalLocation;
  public out_device: any | null; // todo
  public out_terminal: any | null; // todo

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
    this.hours = apiUserClockedOut.hours;
    this.hours_auto = apiUserClockedOut.hours_auto;
    this.notes = apiUserClockedOut.notes ?? null;
    this.shift = apiUserClockedOut.shift;
    this.in_method = apiUserClockedOut.in_method;
    this.in_location = apiUserClockedOut.in_location;
    this.in_device = apiUserClockedOut.in_device ?? null;
    this.in_terminal = apiUserClockedOut.in_terminal ?? null;
    this.out_method = apiUserClockedOut.out_method;
    this.out_location = apiUserClockedOut.out_location;
    this.out_device = apiUserClockedOut.out_device ?? null;
    this.out_terminal = apiUserClockedOut.out_terminal ?? null;
  }
}
