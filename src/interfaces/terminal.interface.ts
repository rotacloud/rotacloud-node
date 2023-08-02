export interface ApiTerminal {
  id: number;
  deleted: boolean;
  name: string;
  active: boolean;
  platform: string | null;
  device: string | null;
  version: string | null;
  ip: string | null;
  location: ApiTerminalLocation | null;
  timezone: number | ExpandedTimeZone;
  require_photo: boolean;
  require_photo_breaks: boolean;
  debug: boolean;
}

export interface ExpandedTimeZone {
  id: number;
  name: string;
  city: string;
  sub: string | null;
}

export interface ApiTerminalLocation {
  lat: number;
  lng: number;
  accuracy: number;
}
