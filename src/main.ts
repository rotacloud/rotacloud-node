import { createSdkClient } from './client-builder.js';
import { SERVICES } from './service.js';

export * from './interfaces/index.js';
export * from './interfaces/query-params/index.js';
export * from './error.js';
export type {
  Addon,
  Entitlement,
  ManagerShiftDropResponse,
  ManagerShiftResponse,
  Plan,
  ProductCatalogueItemPrice,
  RegularEmployeeShiftResponse,
  SelfShiftResponse,
  ShiftDropResponse,
  ShiftSwapResponse,
  StairStep,
  ToilAllowance,
  UpdatedAddon,
} from './generated/api-types.js';
export const createRotaCloudClient = createSdkClient(SERVICES);
