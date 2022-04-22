import { ApiLeaveDate } from './index.js';

export interface ApiLeave {
  id: number;
  deleted: boolean;
  deleted_at: number;
  deleted_by: number;
  type: number;
  user: number;
  admin: number;
  status: string;
  requested: boolean;
  user_message: string;
  admin_message: string;
  start_date: string;
  start_am_pm: string;
  end_date: string;
  end_am_pm: string;
  hours: { [key: string]: number };
  hours_method: string;
  hours_set: boolean;
  dates: ApiLeaveDate[];
  requested_at: number;
  paid: boolean;
  replied_at: number;
  // for creating leave
  users?: number[];
}
