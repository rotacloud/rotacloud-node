export interface LocationsQueryParams {
  ids?: number[];
  search?: string;
  only_visible?: boolean;
  only_managed?: boolean;
  include_deleted?: boolean;
}
