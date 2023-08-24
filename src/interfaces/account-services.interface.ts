import { AccountService } from './index.js';

export interface AccountServices {
  time_attendance: AccountService;
  sms: AccountService;
  pro: AccountService;
}
