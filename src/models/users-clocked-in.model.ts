import { ApiUserClockedIn, ApiShift } from '../interfaces/index.js';

export class UserClockedIn {
  public user: number;
  public location: number | null;
  public role: number;
  public in_time: number;
  public minutes_late: number;
  public shift: Pick<ApiShift, 'id' | 'start_time' | 'end_time' | 'minutes_break' | 'location' | 'role'>;
  public in_method: string;
  public in_location: any; // ?
  public in_device: null; // ?
  public in_terminal: null; // ?

  constructor(apiUserClockedIn: ApiUserClockedIn) {
    this.user = apiUserClockedIn.user;
    this.location = apiUserClockedIn.location;
    this.role = apiUserClockedIn.role;
    this.in_time = apiUserClockedIn.in_time;
    this.minutes_late = apiUserClockedIn.minutes_late;
    this.shift = apiUserClockedIn.shift;
    this.in_method = apiUserClockedIn.in_method;
    this.in_location = apiUserClockedIn.in_location;
    this.in_device = apiUserClockedIn.in_device;
    this.in_terminal = apiUserClockedIn.in_terminal;
  }
}
