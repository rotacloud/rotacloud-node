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

/**
 * A shift returned by the V2 shifts endpoint.
 *
 * Manager-only and assigned-user fields are optional because the endpoint
 * returns a permission-dependent response shape.
 */
export interface ShiftV2 {
  id: number;
  published: boolean;
  open: boolean;
  userId: number | null;
  locationId: number;
  roleId: number | null;
  startTime: string;
  endTime: string;
  minutesBreak: number;
  createdAt: string;
  dropRequests: ShiftDropRequestV2[];
  swapRequests: ShiftSwapRequestV2[];
  notes?: string;
  claimOpenShiftApprovalRequired: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  updatedAt?: string | null;
  claimedAt?: string | null;
  claimed?: boolean;
  acknowledgedAt?: string | null;
  acknowledged?: boolean;
  deleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: number | null;
}
