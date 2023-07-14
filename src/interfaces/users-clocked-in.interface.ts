import { ApiShift, ApiTerminalLocation } from '../interfaces/index.js';

export interface ApiUserClockedIn {
  user: number;
  location: any; // todo
  role: number;
  in_time: number;
  minutes_late: number;
  shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: ApiTerminalLocation;
  in_device: any | null; // todo
  in_terminal: any | null; // todo
}
