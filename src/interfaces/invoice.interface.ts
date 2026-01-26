export type InvoiceStatus = 'paid' | 'posted' | 'payment_due' | 'not_paid' | 'voided' | 'pending';

export type PricingModel = 'flat_fee' | 'per_unit' | 'tiered' | 'volume' | 'stairstep';

export interface Invoice {
  id: string;
  /** The status of the invoice */
  status: InvoiceStatus;
  /** The currency code of the invoice, e.g., GBP */
  currencyCode: string;
  /** The total amount of the invoice in subunits (pence, cents, etc.) */
  total: number | null;
  amountDue: number | null;
  /** The date and time in ISO 8601 format when the invoice was issued  */
  date: string | null;
  /** The date and time in ISO 8601 format when the invoice is due  */
  dueDate: string | null;
  deleted: boolean;
  /** The date and time in ISO 8601 format when the invoice was last updated  */
  updatedAt: string | null;
  /** The purchase order number associated with this invoice */
  poNumber: number | null;
  recurring: boolean | null;
  vatNumber: string | null;
  priceType: string | null;
  netTermDays: number | null;
  amountPaid: number | null;
  amountAdjusted: number | null;
  writeOffAmount: number | null;
  creditsApplied: number | null;
  /** Date and time in ISO 8601 format  */
  paidAt: string | null;
  dunningStatus: string | null;
  /** Date and time in ISO 8601 format  */
  nextRetryAt: string | null;
  /** Date and time in ISO 8601 format  */
  voidedAt: string | null;
  subTotal: number | null;
  tax: number | null;
  lineItems: LineItem[] | null;
  downloadLink: string;
  downloadLinkExpiresAt: string;
}

export interface LineItem {
  unitAmount: number;
  quantity?: number;
  amount?: number;
  pricingModel?: PricingModel;
  description: string;
  entityDescription?: string;
}

export interface InvoiceQueryParameters {
  /** The max number of items to return */
  limit?: number;
  /** The cursor after which the next page should be fetched. Comes from the previous page's response */
  cursor?: string;
  /** Invoice status to filter by */
  status?: InvoiceStatus;
  /** The date to filter from, e.g., 2025-01-01 */
  dateFrom?: string;
  /** The date to filter to, e.g., 2025-12-30 */
  dateTo?: string;
  /** The minimum total amount of the invoice */
  minTotal?: number;
  /** The maximum total amount of the invoice */
  maxTotal?: number;
}
