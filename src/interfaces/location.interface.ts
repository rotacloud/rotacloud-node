import { ApiLocationCoordinate } from './index.js';

export interface ApiLocation {
  id: number;
  name: string;
  deleted: boolean;
  address: string;
  location: ApiLocationCoordinate;
  timezone: number;
  users: [];
  managers: [];
  metadata: null;
  clock_in_ips: null;
}
