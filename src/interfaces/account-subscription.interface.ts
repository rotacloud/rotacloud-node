export interface Entitlement {
  id: string;
}

export interface Plan {
  id: string;
  status: { name: 'active' | 'in_trial' };
}
export interface PlanExtended extends Plan {
  trialEnds: string;
  pricing: PlanPricing;
}

export interface Addon {
  id: string;
  status: { name: 'active' | 'in_trial' | 'hidden' };
}
export interface AddonExtended extends Addon {
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

export interface AccountSubscription {
  status: 'in_trial' | 'active' | 'non_renewing' | 'paused' | 'cancelled';
  dunningEnds?: string;
  entitlements: Entitlement[];
  plans: Plan[];
  addons: Addon[];
}

export interface AccountSubscriptionExtended extends AccountSubscription {
  billingFrequency: string;
  paymentFrequency: 'monthly' | 'yearly';
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
  plans?: { planId: string; trial?: boolean }[];
  addons?: { addonId: string; trial?: boolean }[];
  subscriptionPaymentSourceId?: string;
  billingEmail?: string;
  country?: number;
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

export interface EstimateLineItem {
  id: string;
  description: string;
  amount: number;
  discountAmount: number;
}

export interface UpdatedPlan {
  planId: string;
  trial?: boolean;
}

export interface UpdatedAddon {
  addonId: string;
  trial?: boolean;
}

export interface EstimatesReq {
  plans?: UpdatedPlan[];
  addons?: UpdatedAddon[];
  paymentFrequency: 'monthly' | 'yearly';
}

export interface EstimatesRes {
  paymentFrequency: 'monthly' | 'yearly';
  subTotal: number;
  chargedImmediately: number;
  creditsApplied: number;
  quantity: number;
  lineItems: EstimateLineItem[];
}
