import { ApiLeaveDate } from './leave-date.interface';

export interface ApiLeaveRequest {
  id: number;
  deleted: boolean;
  type: number;
  user: number;
  user_message: string | null;
  start_date: string;
  start_am_pm: null;
  end_date: string;
  end_am_pm: null;
  dates: ApiLeaveDate[];
}