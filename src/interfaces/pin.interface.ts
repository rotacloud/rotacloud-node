import { User } from './index.js';

export interface Pin
  extends Omit<
    User,
    | 'created_at'
    | 'created_by'
    | 'deleted_at'
    | 'deleted_by'
    | 'middle_name'
    | 'preferred_name'
    | 'two_factor_enabled'
    | 'has_account'
    | 'invite_sent'
    | 'pin'
  > {}
