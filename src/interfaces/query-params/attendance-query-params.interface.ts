export interface AttendanceQueryParams {
  start: number;
  end: number;
  users?: number[];
  locations?: number[];
  roles?: number[];
  approved?: boolean;
  include_deleted?: boolean;
}
