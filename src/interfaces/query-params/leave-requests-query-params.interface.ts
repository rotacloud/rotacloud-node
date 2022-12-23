export interface LeaveRequestsQueryParams {
  status?: 'requested' | 'approved' | 'denied' | 'expired';
  include_deleted?: boolean;
}
