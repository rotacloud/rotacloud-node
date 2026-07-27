/** Filters supported by the V2 shifts list endpoint. */
export interface ShiftsV2QueryParams {
  start?: string;
  end?: string;
  ids?: number[];
  users?: number[];
  locations?: number[];
  roles?: number[];
  open?: boolean;
  published?: boolean;
  deleted?: boolean;
  acknowledged?: boolean;
  createdBy?: number[];
  createdAtStart?: string;
  createdAtEnd?: string;
  hasNotes?: boolean;
}
