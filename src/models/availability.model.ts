import { ApiAvailability, ApiAvailabilityDate } from '../interfaces/index.js';

export class Availability {
  public user: number;
  public dates: ApiAvailabilityDate[];

  constructor(availability: ApiAvailability) {
    this.user = availability.user;
    this.dates = availability.dates;
  }
}
