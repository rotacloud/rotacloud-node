interface ShiftsV2Filters {
  ids?: number[];
  users?: number[];
  locations?: number[];
  roles?: number[];
  open?: boolean;
  published?: boolean;
  deleted?: boolean;
  acknowledged?: boolean;
  createdBy?: number[];
  hasNotes?: boolean;
}

type ShiftDateRange = {
  start: string;
  end: string;
};

type CreationDateRange = {
  createdAtStart: string;
  createdAtEnd: string;
};

/**
 * Filters supported by the V2 shifts list endpoint.
 *
 * At least one complete shift or creation date range is required. Both ranges
 * may be supplied together, but neither may be supplied partially.
 */
export type ShiftsV2QueryParams = ShiftsV2Filters &
  (
    | (ShiftDateRange & { createdAtStart?: never; createdAtEnd?: never })
    | (CreationDateRange & { start?: never; end?: never })
    | (ShiftDateRange & CreationDateRange)
  );
