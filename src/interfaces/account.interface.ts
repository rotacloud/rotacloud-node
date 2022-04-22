import { ApiAccountServices } from './index.js';

export interface ApiAccount {
  id: number;
  name: string;
  level: string;
  created: number;
  expired: boolean;
  owner: number;
  timezone: number;
  industry: number;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string;
  postcode: string;
  country: number;
  services: ApiAccountServices[];
  total_price: number;
  pricing: object;
  expires_in: number;
  features_disabled: string[];
  first_billed: string;
  owed: number;
  trial: boolean;
  can_restart_trial: boolean;
  next_billed: string;
  hide_billing: boolean;
  total_employees: number;
  payment_card: string;
  billing_type: string;
  billing_term: string;
  billing_email: string;
  billing_address: string;
  grouped_billing_parent: number;
  grouped_billing_children: number[];
  vat_number: string;
  suspended: boolean;
  suspended_message: string;
}