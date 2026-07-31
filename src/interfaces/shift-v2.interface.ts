import type { ManagerShiftResponse, RegularEmployeeShiftResponse, SelfShiftResponse } from '../generated/api-types.js';

/**
 * A shift returned by the V2 shifts endpoint.
 *
 * The response shape depends on the requesting user's relationship to the
 * shift. Narrow the union with an `in` check before accessing fields that are
 * only present in one response shape.
 */
export type ShiftV2 = ManagerShiftResponse | SelfShiftResponse | RegularEmployeeShiftResponse;
