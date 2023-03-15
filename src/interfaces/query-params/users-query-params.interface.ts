export interface UsersQueryParams {
  ids?: number[];
  locations?: number[];
  /**
   * Works different from {UserQueryParams.locations},
   * When filtering out employees for rota, this is more suggested,
   * one scenario would be filtering out employees base on their starting and
   * final working date, using {UserQueryParams.locations} will not work in tandem
   * of {UserQueryParams.start_date} and {UserQueryParams.end_date}
   */
  location?: number;
  roles?: number[];
  only_managed?: boolean;
  include_self?: boolean;
  level?: string;
  search?: string;
  order?: string;
  period?: string;
  start_time?: number;
  end_time?: number;
  start_date?: string;
  end_date?: string;
  include_deleted?: boolean;
}
