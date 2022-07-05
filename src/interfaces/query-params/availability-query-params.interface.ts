export interface AvailabilityQueryParams {
  /** Start of date range for fetching availability (ISO date format `YYYY-MM-DD`) */
  start?: string;
  /** End of date range for fetching availability (inclusive) (ISO date format `YYYY-MM-DD`)  */
  end?: string;
  /**
   * List of user IDs to get availability for
   *
   * If undefined, all users on the account will be selected
   */
  users?: number[];
}
