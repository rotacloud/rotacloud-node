export interface Terminal {
  id: number;
  deleted: boolean;
  name: string;
  active: boolean;
  platform: string | null;
  device: string | null;
  version: string | null;
  ip: string | null;
  location: TerminalLocation | null;
  timezone: number;
  require_photo: boolean;
  require_photo_breaks: boolean;
  debug: boolean;
  secret: string | null;
}

export interface TerminalLocation {
  lat: number;
  lng: number;
  accuracy: number;
}
