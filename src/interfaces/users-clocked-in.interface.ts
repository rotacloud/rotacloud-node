import { ApiShift } from '../interfaces/index.js';

export interface ApiUserClockedIn {
  user: number;
  location: number | null;
  role: number;
  in_time: number;
  minutes_late: number;
  shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  in_device: null;
  in_terminal: null;
}
