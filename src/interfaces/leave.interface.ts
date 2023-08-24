import { LeaveDate } from './index.js';

export interface Leave {
  id: number;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  type: number;
  user: number;
  admin: number;
  status: string;
  requested: boolean;
  user_message: string | null;
  admin_message: string | null;
  start_date: string;
  start_am_pm: string;
  end_date: string;
  end_am_pm: string;
  hours: { [key: string]: number | null };
  hours_method: string;
  hours_set: boolean;
  dates: LeaveDate[];
  requested_at: number;
  paid: boolean;
  replied_at: number;
  // for creating leave
  users?: number[];
}
