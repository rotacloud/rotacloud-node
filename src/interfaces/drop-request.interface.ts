export type RequestStatus = 'expired' | 'shift_changed' | 'approved' | 'denied' | 'requested';

export interface ShiftDropRequest {
  id: number;
  deleted: boolean;
  status: RequestStatus;
  requested_at: number;
  shift: number;
  user: number;
  user_message: string;
  admin?: number;
  admin_message?: string;
  replied_at?: number;
}
