import { ApiUser } from './index.js';

export interface ApiPin
  extends Omit<
    ApiUser,
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
