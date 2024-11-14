import { Leave, Shift, TimeZone } from './interfaces';
import { Operation, OpFunctionFactory } from './ops';
import { LeaveQueryParams, ShiftsQueryParams } from './rotacloud';

export type EndpointVersion = 'v1' | 'v2';
export interface Endpoint<T = unknown, QueryParameters extends object | undefined = any> {
  type: T;
  queryParameters?: QueryParameters;
}
export type ServiceSpecification =
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v1'];
      /** API version of the endpoint */
      endpointVersion: 'v1';
      /** Operations allowed and usable for the endpoint */
      operations: Operation[];
      /**
       * Operations unique to the serive
       * Can be used to override operations listed in {@see ServiceSpecification['operations']}
       */
      customOperations?: Record<string, OpFunctionFactory>;
    }
  | {
      /** URL of the endpoint */
      endpoint: keyof EndpointEntityMap['v2'];
      /** API version of the endpoint */
      endpointVersion: 'v2';
      /** Operations allowed and usable for the endpoint */
      operations: Operation[];
      /**
       * Operations unique to the serive
       * Can be used to override operations listed in {@see ServiceSpecification['operations']}
       */
      customOperations?: Record<string, OpFunctionFactory>;
    };

/** Mapping between a endpoint URL and it's associated entity type */
export interface EndpointEntityMap extends Record<EndpointVersion, Record<string, Endpoint>> {
  /** Type mappings for v1 endpoints  */
  v1: {
    shifts: {
      type: Shift;
      queryParameters: ShiftsQueryParams;
    };
    leave: {
      type: Leave;
      queryParameters: LeaveQueryParams;
    };
    timezones: {
      type: TimeZone;
    };
  };
  /** Type mappings for v2 endpoints */
  v2: {
    shifts: {
      type: Shift;
      queryParameters: ShiftsQueryParams;
    };
  };
}

/**
 * List of all supported service specifications
 * used to generate the SDK client
 */
export const SERVICES = {
  shifts: {
    endpoint: 'shifts',
    endpointVersion: 'v2',
    operations: ['get', 'list', 'delete'],
  },
  leave: {
    endpoint: 'leave',
    endpointVersion: 'v1',
    operations: ['get', 'list', 'delete'],
  },
  timeZone: {
    endpoint: 'timezones',
    endpointVersion: 'v1',
    operations: ['get', 'list'],
  },
} satisfies Record<string, ServiceSpecification>;
