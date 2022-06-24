export interface ApiAvailabilityPeriod {
  start_time: string;
  end_time: string;
}

export interface ApiAvailabilityDate {
  date: string;
  available: ApiAvailabilityPeriod[];
  unavailable: ApiAvailabilityPeriod[];
}

export interface ApiAvailability {
  user: number;
  dates: ApiAvailabilityDate[];
}
