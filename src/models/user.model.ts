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
  id: number;
  created_at: number;
  created_by: number;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  level: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  preferred_name: string | null;
  photo: string | null;
  two_factor_enabled: boolean;
  email: string;
  has_account: boolean;
  invite_sent: boolean;
  group: number | null;
  locations: number[];
  roles: number[];
  default_role: number | null;
  dob: string | null;
  start_date: string | null;
  final_working_date: string | null;
  weekly_hours: number | null;
  holiday_allowance: number;
  holiday_allowance_unit: string;
  payroll_id: string | null;
  salary: number;
  salary_type: string;
  overtime_rate: number;
  role_rates: LeaveRates;
  leave_rates: RoleRates;
  leave_rates_unit: string;
  leave_rates_type: string;
  notes: string | null;

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
