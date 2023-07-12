import { ApiShift } from './index.js';

export interface ApiUserClockedOut {
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
  notes: null;
  shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  in_method: string;
  in_location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  in_device: null;
  in_terminal: null;
  out_method: string;
  out_location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  out_device: null;
  out_terminal: null;
}
