import { ApiAvailabilityPeriod } from './index.js';

export interface ApiAvailabilityPatternAvailability {
  available: ApiAvailabilityPeriod[];
  unavailable: ApiAvailabilityPeriod[];
}

export interface ApiAvailabilityPattern {
  id: number;
  user: number;
  name: string;
  start_date: string;
  end_date: string;
  repeat_weeks: number;
  mon: ApiAvailabilityPatternAvailability;
  tue: ApiAvailabilityPatternAvailability;
  wed: ApiAvailabilityPatternAvailability;
  thu: ApiAvailabilityPatternAvailability;
  fri: ApiAvailabilityPatternAvailability;
  sat: ApiAvailabilityPatternAvailability;
  sun: ApiAvailabilityPatternAvailability;
}
