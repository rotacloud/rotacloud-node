import { ApiLocation, ApiLocationCoordinate } from '../interfaces/index.js';

export class Location {
  public id: number;
  public name: string;
  public deleted: boolean;
  public address: string;
  public location: ApiLocationCoordinate;
  public timezone: number;
  public users: number[];
  public managers: number[];
  public metadata: object;
  public clock_in_ips: string[];

  constructor(location: ApiLocation) {
    this.id = location.id;
    this.name = location.name;
    this.deleted = location.deleted;
    this.address = location.address;
    this.location = location.location;
    this.timezone = location.timezone;
    this.users = location.users;
    this.managers = location.managers;
    this.metadata = location.metadata;
    this.clock_in_ips = location.clock_in_ips;
  }
}
