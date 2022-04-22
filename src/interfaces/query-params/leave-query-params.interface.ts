export interface LeaveQueryParams {
  start?: string;
  end?: string;
  year?: number;
  users?: number[];
  types?: number[];
  order?: string;
  only_managed?: boolean;
  include_deleted?: boolean;
  include_denied?: boolean;
  include_requested?: boolean;
  include_expired?: boolean;
}
