export interface PayPeriod {
  id: number;
  start_date: string;
  end_date: string;
  name: string;
  locked: boolean;
  locked_at: number;
  locked_by: number;
  unlocked_at: null;
  unlocked_by: null;
  finalised: boolean;
  finalised_at: number;
  finalised_by: number;
  unfinalised_at: null;
  unfinalised_by: null;
}
