import { ApiUser } from '../interfaces/user.interface.js';

export interface LeaveRates {
  [leave_type_id: string]: number;
}

export interface RolePayCodes {
  [role_id: string]: string;
}

export interface RoleRates {
  [role_id: string]: {
    per_hour: number;
    per_shift: number;
  };
}

export interface Preferences {
  setup_steps_hidden: boolean;
}

export interface TeamProperties {
  admin?: boolean;
  features?: string[];
  permissions?: string[];
  product_updates_access_key?: string;
  product_updates_access_secret?: string;
  intercom?: any;
  [other_properties: string]: any;
}

// Models should be an abstraction over Api Models/Responses
export class User {
  public id: number;
  public first_name: string;
  public last_name: string;
  public photo: string | null;
  public preferred_name: string | null;

  constructor(user: ApiUser) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.photo = user.photo;
    this.preferred_name = user.preferred_name;
  }
}
