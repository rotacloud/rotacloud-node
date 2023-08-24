import { Shift } from './index.js';

export interface AttendanceLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface Attendance {
  id: number;
  deleted: boolean;
  approved: boolean;
  in_time: number;
  out_time: number;
  minutes_break: number;
  user: number;
  location: number;
  role: number;
  minutes_late: number;
  hours: number;
  hours_auto: number;
  hours_is_auto: boolean;
  notes: string | null;
  shift: Shift | null;
  in_method: string;
  out_method: string;
  in_location: AttendanceLocation;
  out_location: AttendanceLocation;
  in_device: number;
  out_device: number;
  in_terminal: null;
  out_terminal: null;
}
