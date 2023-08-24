import { LeaveDate } from './leave-date.interface';

export interface LeaveRequest {
  id: number;
  deleted: boolean;
  type: number;
  user: number;
  user_message: string | null;
  start_date: string;
  start_am_pm: string;
  end_date: string;
  end_am_pm: string;
  dates: LeaveDate[];
}
