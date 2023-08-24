export interface AvailabilityPeriod {
  start_time: string;
  end_time: string;
}

export interface AvailabilityDate {
  date: string;
  available: AvailabilityPeriod[];
  unavailable: AvailabilityPeriod[];
}

export interface Availability {
  user: number;
  dates: AvailabilityDate[];
}
