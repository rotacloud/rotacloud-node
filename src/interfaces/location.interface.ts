import { ApiLocationCoordinate } from './index.js';

export interface ApiLocation {
  id: number;
  name: string;
  deleted: boolean;
  address: string;
  location: ApiLocationCoordinate;
  timezone: number;
  users: number[];
  managers: number[];
  metadata: object;
  clock_in_ips: string[];
}
