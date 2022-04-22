import { ApiAvailability, ApiAvailabilityDates } from '../interfaces/index.js';

export class Availability {
  public user: number;
  public dates: ApiAvailabilityDates[];

  constructor(availability: ApiAvailability) {
    this.user = availability.user;
    this.dates = availability.dates;
  }
}
