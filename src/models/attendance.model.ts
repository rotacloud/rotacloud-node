import { ApiAttendance, ApiTerminalLocation, ApiShift } from '../interfaces/index.js';

export class Attendance {
  public id: number;
  public deleted: boolean;
  public approved: boolean;
  public in_time: number;
  public out_time: number;
  public minutes_break: number;
  public user: number;
  public location: number;
  public role: number;
  public minutes_late: number;
  public hours: number;
  public hours_auto: number;
  public hours_is_auto: boolean;
  public notes: string | null;
  public shift: ApiShift | null;
  public in_method: string;
  public out_method: string;
  public in_location: ApiTerminalLocation;
  public out_location: ApiTerminalLocation;
  public in_device: number;
  public out_device: number;
  public in_terminal: number | null;
  public out_terminal: number | null;

  constructor(attendance: ApiAttendance) {
    this.id = attendance.id;
    this.deleted = attendance.deleted;
    this.approved = attendance.approved;
    this.in_time = attendance.in_time;
    this.out_time = attendance.out_time;
    this.minutes_break = attendance.minutes_break;
    this.user = attendance.user;
    this.location = attendance.location;
    this.role = attendance.role;
    this.minutes_late = attendance.minutes_late;
    this.hours = attendance.hours;
    this.hours_auto = attendance.hours_auto;
    this.hours_is_auto = attendance.hours_is_auto;
    this.notes = attendance.notes;
    this.shift = attendance.shift;
    this.in_method = attendance.in_method;
    this.out_method = attendance.out_method;
    this.in_location = attendance.in_location;
    this.out_location = attendance.out_location;
    this.in_device = attendance.in_device;
    this.out_device = attendance.out_device;
    this.in_terminal = attendance.in_terminal;
    this.out_terminal = attendance.out_terminal;
  }
}
