export interface Entitlement {
  id: string;
}

export interface Plan {
  id: string;
  status: { name: 'active' | 'in_trial' };
}

export interface Addon {
  id: string;
  status: { name: 'active' | 'in_trial' | 'hidden' };
}

export interface AccountSubscription {
  status: string;
  dunningEnds?: string;
  entitlements: Entitlement[];
  plans: Plan[];
  addons: Addon[];
}

export interface AccountSubscriptionExtended extends AccountSubscription {
  billingFrequency: string;
  billingEmail: string;
  country: number;
  subscriptionPaymentSourceId: string;
  nextBillingAt: string;
  trialEnds: string;
  canRestartTrial: boolean;
  totalPrice: number;
}

export interface SubscriptionUpdateReq {
  paymentFrequency: 'monthly' | 'yearly';
  plans: [{ planId: string; trial?: boolean }];
  addons: [{ addonId: string; trial?: boolean }];
  subscriptionPaymentSourceId: string;
  billingEmail: string;
  country: number;
}

export interface EstimatesRes {
    owed: number;
    totalPrice: number;
}
