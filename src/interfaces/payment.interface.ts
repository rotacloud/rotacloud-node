export interface PaymentSource {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'valid' | 'expiring' | 'expired' | 'invalid' | 'pending_verification';
  type: string;
  deleted: boolean;
  card: PaymentCardInfoV2;
}

export interface PaymentCardInfoV2 {
  sourceId: string;
  firstName: string;
  lastName: string;
  brand: string;
  expMonth: number;
  expYear: number;
  last4: string;
  type: string;
  primary: boolean;
  fundingType: 'credit' | 'debit' | 'prepaid' | 'not_known' | 'not_applicable';
}

export interface Country {
  id: number;
  name: string;
  phone_prefix: string | null;
  vat_rate: number | null;
  allow_phone: boolean;
  charge_vat: boolean;
  require_vat_number: boolean;
}

export interface StairStep {
  price: number;
  endingUnit?: number;
  startingUnit: number;
}
