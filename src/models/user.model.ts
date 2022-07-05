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
  public created_at: number;
  public created_by: number;
  public deleted: boolean;
  public deleted_at: number | null;
  public deleted_by: number | null;
  public level: string;
  public first_name: string;
  public middle_name: string | null;
  public last_name: string;
  public preferred_name: string | null;
  public photo: string | null;
  public two_factor_enabled: boolean;
  public email: string;
  public has_account: boolean;
  public invite_sent: boolean;
  public group: number | null;
  public locations: number[];
  public roles: number[];
  public default_role: number | null;
  public dob: string | null;
  public start_date: string | null;
  public final_working_date: string | null;
  public weekly_hours: number | null;
  public holiday_allowance: number;
  public holiday_allowance_unit: string;
  public payroll_id: string | null;
  public salary: number;
  public salary_type: string;
  public overtime_rate: number;
  public role_rates: LeaveRates;
  public leave_rates: RoleRates;
  public leave_rates_unit: string;
  public leave_rates_type: string;
  public notes: string | null;

  constructor(user: ApiUser) {
    this.id = user.id;
    this.created_at = user.created_at;
    this.created_by = user.created_by;
    this.deleted = user.deleted;
    this.deleted_at = user.deleted_at;
    this.deleted_by = user.deleted_by;
    this.level = user.level;
    this.first_name = user.first_name;
    this.middle_name = user.middle_name;
    this.last_name = user.last_name;
    this.preferred_name = user.preferred_name;
    this.photo = user.photo;
    this.two_factor_enabled = user.two_factor_enabled;
    this.email = user.email;
    this.has_account = user.has_account;
    this.invite_sent = user.invite_sent;
    this.group = user.group;
    this.locations = user.locations;
    this.roles = user.roles;
    this.default_role = user.default_role;
    this.dob = user.dob;
    this.start_date = user.start_date;
    this.final_working_date = user.final_working_date;
    this.weekly_hours = user.weekly_hours;
    this.holiday_allowance = user.holiday_allowance;
    this.holiday_allowance_unit = user.holiday_allowance_unit;
    this.payroll_id = user.payroll_id;
    this.salary = user.salary;
    this.salary_type = user.salary_type;
    this.overtime_rate = user.overtime_rate;
    this.role_rates = user.role_rates;
    this.leave_rates = user.leave_rates;
    this.leave_rates_unit = user.leave_rates_unit;
    this.leave_rates_type = user.leave_rates_type;
    this.notes = user.notes;
  }
}
