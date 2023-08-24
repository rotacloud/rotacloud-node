export interface AccountService {
  active: boolean;
  billed: boolean;
  hidden: boolean;
  trial_expires?: string;
}
