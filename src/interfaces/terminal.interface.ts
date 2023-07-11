import { ApiLocationCoordinate } from './location-coordinate.interface.js';

export interface ApiTerminal {
  id: number;
  deleted: boolean;
  name: string;
  active: boolean;
  platform: string | null;
  device: string | null;
  version: string | null;
  ip: string | null;
  location: ApiLocationCoordinate | null;
  timezone: number;
  require_photo: boolean;
  require_photo_breaks: boolean;
  debug: boolean;
}
