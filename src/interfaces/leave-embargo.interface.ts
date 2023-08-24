export interface LeaveEmbargo {
  id: number;
  start_date: string;
  start_am_pm: string;
  end_date: string;
  end_am_pm: string;
  everyone: boolean;
  users: number[];
  message: string;
}
