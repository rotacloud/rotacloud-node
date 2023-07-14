import { ApiShift, ApiTerminalLocation } from './index.js';

export interface ApiUserClockedOut {
  id: number;
  deleted: boolean;
  approved: boolean;
  user: number;
  location: any; // todo
  role: number;
  in_time: number;
  out_time: number;
  minutes_break: number;
  minutes_late: number;
  hours: number;
  hours_auto: number;
  hours_is_auto: boolean;
  notes: string | null;
  shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: ApiTerminalLocation;
  in_device: any | null; // todo
  in_terminal: any | null; // todo
  out_method: string;
  out_location: ApiTerminalLocation;
  out_device: any | null; // todo
  out_terminal: any | null; // todo
}
