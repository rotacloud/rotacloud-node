import { ApiAccount } from '../interfaces/index.js';

export class Account {
  id: number;
  name: string;
  level: string;
  created: number;
  expired: boolean;
  owner: number;
  timezone: number;
  industry: number;
  phone: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: number;
  services: any;
  total_price: number;
  pricing: { current: boolean; name: string; max_employees: number; total_price: number };
  expires_in: number;
  features_disabled: string[];
  first_billed: string | null;
  owed: number;
  trial: boolean;
  can_restart_trial: boolean;
  next_billed: string;
  hide_billing: boolean;
  total_employees: number;
  payment_card: string | null;
  billing_type: string;
  billing_term: string;
  billing_email: string | null;
  billing_address: string | null;
  grouped_billing_parent: number | null;
  grouped_billing_children: number[] | null;
  vat_number: string | null;
  suspended: boolean;
  suspended_message: string | null;

  constructor(account: ApiAccount) {
    Object.assign(this, account);
  }
}
