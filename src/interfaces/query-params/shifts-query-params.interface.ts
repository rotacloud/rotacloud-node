export interface ShiftsQueryParams {
  start?: number;
  end?: number;
  ids?: number[];
  users?: number[];
  locations?: number[];
  roles?: number[];
  open?: boolean;
  published?: boolean;
  acknowledged?: boolean;
  deleted?: boolean;
  sort?: string;
  include_deleted?: boolean;
}
