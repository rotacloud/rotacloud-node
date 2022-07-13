import { ApiLocation } from '../interfaces/index.js';

export class LatLngObject {
  public lat: number;
  public lng: number;
  public radius: number;
}

export class Location {
  public id: number;
  public name: string;
  public deleted: boolean;
  public address: string;
  public location: LatLngObject;
  public timezone: number;
  public users: number[];
  public managers: number[];
  public metadata: object;
  public clock_in_ips: string[];

  constructor(locaiton: ApiLocation) {
    this.id = locaiton.id;
    this.name = locaiton.name;
    this.deleted = locaiton.deleted;
    this.address = locaiton.address;
    this.location = locaiton.location;
    this.timezone = locaiton.timezone;
    this.users = locaiton.users;
    this.managers = locaiton.managers;
    this.metadata = locaiton.metadata;
    this.clock_in_ips = locaiton.clock_in_ips;
  }
}
