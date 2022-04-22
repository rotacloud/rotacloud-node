export interface UsersQueryParams {
  ids?: number[];
  locations?: number[];
  roles?: number[];
  only_managed?: boolean;
  include_self?: boolean;
  level?: string;
  search?: string;
  order?: string;
  period?: string;
  location?: number;
  start_time?: number;
  end_time?: number;
  start_date?: string;
  end_date?: string;
  include_deleted?: boolean;
}
