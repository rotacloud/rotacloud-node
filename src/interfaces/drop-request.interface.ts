import type { RequestStatus } from './request-status.interface.js';

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
