export type RequestStatus = 'expired' | 'shift_changed' | 'approved' | 'denied' | 'requested';

export interface ShiftSwapRequest {
  id: number;
  deleted: boolean;
  status: RequestStatus;
  requested_at: number;
  old_user: number;
  new_user: number;
  admin: number | null;
  user_approved: boolean | null;
  user_replied_at: number | null;
  admin_approved: boolean | null;
  admin_replied_at: number | null;
  shift: number;
  swapped_shift: number;
}
