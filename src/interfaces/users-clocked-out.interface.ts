import { Shift, TerminalLocation } from './index.js';

export interface UserClockedOut {
  id: number;
  deleted: boolean;
  approved: boolean;
  user: number;
  location: number;
  role: number;
  in_time: number;
  out_time: number;
  minutes_break: number;
  minutes_late: number;
  hours: number;
  hours_auto: number;
  hours_is_auto: boolean;
  notes: string | null;
  shift: Pick<Shift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: TerminalLocation;
  in_device: string | null;
  in_terminal: number | null;
  out_method: string;
  out_location: TerminalLocation;
  out_device: string | null;
  out_terminal: number | null;
}
