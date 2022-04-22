export interface UnavailabilityRequestsQueryParams {
  status?: string;
  start?: number;
  end?: number;
  shift_start?: number;
  shift_end?: number;
  include_deleted?: boolean;
}
