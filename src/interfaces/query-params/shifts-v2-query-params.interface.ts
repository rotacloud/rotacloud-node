import type { operations } from '../../generated/api-types.js';

type GeneratedShiftsV2Query = NonNullable<operations['ShiftsV2Controller_getShifts']['parameters']['query']>;

type ShiftDateRange = Required<Pick<GeneratedShiftsV2Query, 'start' | 'end'>>;

type CreationDateRange = Required<Pick<GeneratedShiftsV2Query, 'createdAtStart' | 'createdAtEnd'>>;

type OmittedShiftsV2Query = Pick<GeneratedShiftsV2Query, 'cursor' | 'limit'> & ShiftDateRange & CreationDateRange;

type ShiftsV2Filters = Omit<GeneratedShiftsV2Query, keyof OmittedShiftsV2Query>;

/**
 * Filters supported by the V2 shifts list endpoint.
 *
 * Filter names and values come from the generated OpenAPI contract. At least
 * one complete shift or creation date range is required. Both ranges may be
 * supplied together, but neither may be supplied partially. Pagination is
 * managed internally by the SDK, so `cursor` and `limit` are not public query
 * parameters.
 */
export type ShiftsV2QueryParams = ShiftsV2Filters &
  (
    | (ShiftDateRange & { createdAtStart?: never; createdAtEnd?: never })
    | (CreationDateRange & { start?: never; end?: never })
    | (ShiftDateRange & CreationDateRange)
  );
