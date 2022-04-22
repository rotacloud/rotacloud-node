export interface ApiShift {
  id: number;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  published: boolean;
  open: boolean;
  start_time: number;
  end_time: number;
  minutes_break: number;
  user: number;
  location: number;
  role: number | null;
  notes: string | null;
  created_by: number;
  created_at: number;
  updated_at: number | null;
  updated_by: number | null;
  claimed: boolean;
  claimed_at: number | null;
  acknowledged: boolean;
  acknowledged_at: number | null;
  swap_requests: number[];
  unavailability_requests: number[];
}
