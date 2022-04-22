import { ApiAvailabilityPatternAvailability, ApiAvailabilityPattern } from '../interfaces/index.js';

export class AvailabilityPattern {
  public id: number;
  public user: number;
  public name: string;
  public start_date: string;
  public end_date: string;
  public repeat_weeks: number;
  public mon: ApiAvailabilityPatternAvailability;
  public tue: ApiAvailabilityPatternAvailability;
  public wed: ApiAvailabilityPatternAvailability;
  public thu: ApiAvailabilityPatternAvailability;
  public fri: ApiAvailabilityPatternAvailability;
  public sat: ApiAvailabilityPatternAvailability;
  public sun: ApiAvailabilityPatternAvailability;

  constructor(apiAvailabilityPatterns: ApiAvailabilityPattern) {
    this.id = apiAvailabilityPatterns.id;
  }
}
