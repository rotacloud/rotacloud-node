export interface SwapRequestsQueryParams {
  status?: string;
  start?: number;
  end?: number;
  old_user?: number;
  new_user?: number;
  include_deleted?: boolean;
}
