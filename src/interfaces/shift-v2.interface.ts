import type { GetV2ShiftsResponse } from '@rotacloud/types';
import type { RequestStatus } from './swap-request.interface.js';

/** A swap request embedded in a V2 shift response. */
export interface ShiftSwapRequestV2 {
  id: number;
  status: RequestStatus;
  requestedAt: string;
  userRepliedAt: string | null;
  adminRepliedAt: string | null;
  oldUserId: number;
  newUserId: number;
  adminId: number | null;
  userApproved: boolean | null;
  adminApproved: boolean | null;
  shiftId: number;
  swappedShiftId: number | null;
}

/** A manager-facing swap request embedded in a V2 shift response. */
export interface ManagerShiftSwapRequestV2 extends ShiftSwapRequestV2 {
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
}

/** A drop request embedded in a V2 shift response. */
export interface ShiftDropRequestV2 {
  id: number;
  status: RequestStatus;
  requestedAt: string;
  repliedAt: string | null;
  userId: number;
  adminId: number | null;
  userMessage: string;
  adminMessage: string;
  shiftId: number;
}

/** A manager-facing drop request embedded in a V2 shift response. */
export interface ManagerShiftDropRequestV2 extends ShiftDropRequestV2 {
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
}

/** A shift returned by the V2 list endpoint, including its permission-dependent response shapes. */
export type ShiftV2 = GetV2ShiftsResponse['data'][number];
