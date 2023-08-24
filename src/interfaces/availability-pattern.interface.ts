import { AvailabilityPeriod } from './index.js';

export interface AvailabilityPatternAvailability {
  available: AvailabilityPeriod[];
  unavailable: AvailabilityPeriod[];
}

export interface ApiAvailabilityPattern {
  id: number;
  user: number;
  name: string;
  start_date: string;
  end_date: string;
  repeat_weeks: number;
  mon: AvailabilityPatternAvailability;
  tue: AvailabilityPatternAvailability;
  wed: AvailabilityPatternAvailability;
  thu: AvailabilityPatternAvailability;
  fri: AvailabilityPatternAvailability;
  sat: AvailabilityPatternAvailability;
  sun: AvailabilityPatternAvailability;
}
