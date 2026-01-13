import { RequirementsOf } from '../utils.js';
import { User } from './user.interface.js';

export interface UpdateUserWithOnboardingInfo {
  title: string;
  gender: string;
  dob: string;
  nationalInsuranceNumber: string;
  address1: string;
  address2: string;
  county: string;
  phone: string;
  postcode: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export type PendingV1User = RequirementsOf<User, 'first_name' | 'last_name' | 'locations' | 'email'>;

export interface AddOrOnboard {
  users: PendingV1User[];
  locations: number[];
}
