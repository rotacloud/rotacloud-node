export interface Entitlement {
  id: string;
}

export interface Plan {
  id: string;
  status: { name: 'active' | 'in_trial' };
}
export interface PlanExtended {
  id: string;
  status: { name: 'active' | 'in_trial' };
  trialEnds: string;
  pricing: PlanPricing;
}

export interface AddonExtended {
  id: string;
  status: { name: 'active' | 'in_trial' | 'hidden' };
  trialEnds: string;
  pricing: PlanPricing;
}

export interface PlanPricing {
  itemPriceId: string;
  price: number;
  pricingModel: 'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'stairstep' | null;
  tiers?: PricingTier;
  currentTier?: PricingTier;
  perUnitPrice?: number;
}

export interface PricingTier {
  startingUnit: number;
  endingUnit: number;
  price: number;
}

export interface Addon {
  id: string;
  status: { name: 'active' | 'in_trial' | 'hidden' };
}

export interface AccountSubscription {
  status: 'in_trial' | 'active' | 'non_renewing' | 'paused' | 'cancelled';
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
  plans: PlanExtended[];
  addons: AddonExtended[];
}

export interface SubscriptionUpdateReq {
  paymentFrequency?: 'monthly' | 'yearly';
  plans?: [{ planId: string; trial?: boolean }];
  addons?: [{ addonId: string; trial?: boolean }];
  subscriptionPaymentSourceId?: string;
  billingEmail?: string;
  country?: number;
}

export interface EstimatesRes {
  owed: number;
  totalPrice: number;
}

export interface ProductCatalogueItemPrice {
  id: string;
  currency: string;
  pricingModel: 'stairstep' | 'perUnit';
  unitPrice?: number;
  stairStep?: { startingUnit: number; endingUnit?: number; tierPrice: number };
  billingPeriod: number;
  billingPeriodUnit: 'monthly' | 'yearly';
}
export interface ProductCatalogueItem {
  id: string;
  name: string;
  itemPrice: ProductCatalogueItemPrice[];
}

export interface ProductCatalogueRes {
  plans: ProductCatalogueItem[];
  addons: ProductCatalogueItem[];
}

export enum CancellationReason {
  'features',
  'value',
  'price',
  'not_using',
  'incompatible',
  'difficulty',
  'using_competitor',
  'sold',
  'temporary_closure',
  'closed',
}
export interface CancelSubscriptionReq {
  reason: CancellationReason;
  message?: string;
  detail?: string;
}
