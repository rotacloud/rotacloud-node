import { LocationCoordinate } from './index.js';

export interface Location {
  id: number;
  name: string;
  deleted: boolean;
  address: string;
  location: LocationCoordinate;
  timezone: number;
  users: number[];
  managers: number[];
  metadata: object;
  clock_in_ips: string[];
}
