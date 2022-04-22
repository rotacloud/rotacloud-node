export class LatLngObject {
  public lat: number;
  public lng: number;
  public radius: number;
}

export class Terminal {
  public id: number;
  public deleted: boolean;
  public name: string;
  public active: boolean;
  public type: string;
  public device: string;
  public version: string;
  public ip: string;
  public location: LatLngObject;
  public timezone: number;
  public require_photo: boolean;
  public require_photo_breaks: boolean;
}
