export interface ApiToilAccrual {
  comments: string;
  created_at: number;
  created_by: number | null;
  date: string;
  deleted: boolean;
  deleted_at: string | null;
  deleted_by: number | null;
  duration_hours: number;
  id: number;
  leave_year: number;
  location_id: number | null;
  user_id: number;
}
