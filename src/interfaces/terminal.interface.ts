export interface Terminal {
  id: number;
  deleted: boolean;
  name: string;
  active: boolean;
  platform: string | null;
  default_location: number | null;
  device: string | null;
  version: string | null;
  ip: string | null;
  location: TerminalLocation | null;
  timezone: number;
  require_photo: boolean;
  require_photo_breaks: boolean;
  debug: boolean;
  secret: string | null;
  server_time?: number;
}

export interface TerminalLocation {
  lat: number;
  lng: number;
  accuracy: number;
}
