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
    this.user = apiAvailabilityPatterns.user;
    this.name = apiAvailabilityPatterns.name;
    this.start_date = apiAvailabilityPatterns.start_date;
    this.end_date = apiAvailabilityPatterns.end_date;
    this.repeat_weeks = apiAvailabilityPatterns.repeat_weeks;
    this.mon = apiAvailabilityPatterns.mon;
    this.tue = apiAvailabilityPatterns.tue;
    this.wed = apiAvailabilityPatterns.wed;
    this.thu = apiAvailabilityPatterns.thu;
    this.fri = apiAvailabilityPatterns.fri;
    this.sat = apiAvailabilityPatterns.sat;
    this.sun = apiAvailabilityPatterns.sun;
  }
}
