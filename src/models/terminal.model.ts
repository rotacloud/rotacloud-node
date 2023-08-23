import { ApiTerminalLocation, ApiTerminal } from '../interfaces/index.js';

export class Terminal {
  public id: number;
  public deleted: boolean;
  public name: string;
  public active: boolean;
  public platform: string | null;
  public device: string | null;
  public version: string | null;
  public ip: string | null;
  public location: ApiTerminalLocation | null;
  public timezone: number;
  public require_photo: boolean;
  public require_photo_breaks: boolean;
  public secret: string | null;

  constructor(terminal: ApiTerminal) {
    this.id = terminal.id;
    this.deleted = terminal.deleted;
    this.name = terminal.name;
    this.active = terminal.active;
    this.platform = terminal.platform;
    this.device = terminal.device;
    this.version = terminal.version;
    this.ip = terminal.ip;
    this.location = terminal.location;
    this.timezone = terminal.timezone;
    this.require_photo = terminal.require_photo;
    this.require_photo_breaks = terminal.require_photo_breaks;
    this.secret = terminal.secret;
  }
}
