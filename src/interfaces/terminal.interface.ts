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
  timezone: number;
  require_photo: boolean;
  require_photo_breaks: boolean;
  debug: boolean;
}

export interface ApiTerminalLocation {
  lat: number;
  lng: number;
  accuracy: number;
}
