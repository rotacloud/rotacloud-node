import { LeaveRequest } from './leave-request.interface';

export interface Leave extends LeaveRequest {
  admin: number;
  admin_message: string | null;
  replied_at: number;
  requested: boolean;
  // for creating leave
  users?: number[];
}
