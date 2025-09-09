import { ManagerPermission } from './user.interface.js';

export interface CreateUserRequest extends PartialUserV2 {
  permissions?: ManagerPermission[];
  coverLocations?: number[];
  managedLocations?: number[];
}

export interface CreateUserResponse extends PartialUserV2 {
  id: number;
}

export interface PartialUserV2 {
  firstName: string;
  lastName: string;
  locations: number[];
  roles: UserRole[];
  email: string | null;
  level: 'admin' | 'employee' | 'manager';
  salary: number;
  salaryType: 'annual' | 'hourly';
}

export interface UserRole {
  id: number;
  perShift?: number;
  perHour?: number;
  payCode?: string;
  isDefault?: boolean;
}
