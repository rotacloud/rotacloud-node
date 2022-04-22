export interface ApiAccountService {
  active: boolean;
  billed: boolean;
  hidden: boolean;
  trial_expires?: string;
}
