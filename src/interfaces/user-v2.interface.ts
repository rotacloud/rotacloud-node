import { LeaveRate } from './leave-rate.interface.js';
import { RoleRate } from './role-rate.interface.js';
import { ManagerPermission } from './user.interface.js';

export interface UserV2 {
  id: number;
  createdAt: number;
  createdBy: number;
  deleted: boolean;
  deletedAt: number | null;
  deletedBy: number | null;
  level: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  preferredName: string | null;
  photo: string | null;
  twoFactorEnabled: boolean;
  email: string;
  hasAccount: boolean;
  inviteSent: boolean;
  group: number | null;
  locations: number[];
  roles: userRole[];
  defaultRole: number | null;
  dob: string | null;
  startDate: string | null;
  finalWorkingDate: string | null;
  weeklyHours: number | null;
  holidayAllowance: number;
  holidayAllowance_unit: string;
  payrollId: string | null;
  salary: number;
  salaryType: string;
  overtimeRate: number;
  roleRates: RoleRate | null;
  leaveRates: LeaveRate;
  leaveRatesUnit: string;
  leaveRatesType: string;
  notes: string | null;
  pin?: string | null;
  salariedCostLocation: number | null;
  permissions: ManagerPermission[];
}

export interface userRole {
  id: number;
  perShift: number;
  perHour: number;
  payCode: string;
  isDefault: boolean;
}
