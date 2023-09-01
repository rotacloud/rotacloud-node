import { LeaveDate } from './leave-date.interface';

export interface LeaveRequest {
  id: number;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  requested_at: number;
  type: number;
  paid: boolean;
  user: number;
  status: 'approved' | 'denied' | 'expired' | 'requested' | 'pending';
  user_message: string | null;
  start_date: string;
  start_am_pm: string;
  end_date: string;
  end_am_pm: string;
  hours: { [year: `${number}`]: number | null };
  hours_method: string;
  hours_set: boolean;
  dates: LeaveDate[];
}
