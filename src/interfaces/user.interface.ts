import { LeaveRate, RoleRate, TerminalLocation } from './index.js';

export type ManagerPermission =
  | 'rotas'
  | 'rota_requests'
  | 'leave_requests'
  | 'leave_self'
  | 'leave_embargoes'
  | 'employees'
  | 'employees_salary'
  | 'timesheets'
  | 'payroll'
  | 'roles'
  | 'reports';
export interface User {
  id: number;
  created_at: number;
  created_by: number;
  deleted: boolean;
  deleted_at: number | null;
  deleted_by: number | null;
  level: 'admin' | 'employee' | 'manager';
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
  salary_type: 'annual' | 'hourly';
  overtime_rate: number;
  role_rates: RoleRate | null;
  leave_rates: LeaveRate;
  leave_rates_unit: string;
  leave_rates_type: string;
  notes: string | null;
  pin: string | null;
  salaried_cost_location: number | null;
  permissions: ManagerPermission[];
}

export interface UserBreak {
  start_time: number;
  start_location: TerminalLocation;
  end_time?: number;
  end_location?: TerminalLocation;
}
