import { Shift, TerminalLocation, UserBreak } from '../interfaces/index.js';

export interface UserClockedIn {
  user: number;
  location: number;
  role: number;
  in_time: number;
  minutes_late: number;
  shift: Pick<Shift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: TerminalLocation;
  in_device: string | null;
  in_terminal: number | null;
  breaks_clocked: UserBreak[];
}
