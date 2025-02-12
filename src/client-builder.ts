import { Axios } from 'axios';
import { createCustomAxiosClient, defaultObject, getBaseRequestConfig } from './utils.js';
import { RetryStrategy, SDKConfig } from './interfaces/index.js';
import { buildOp, getOpMap, OpDef, OperationContext } from './ops.js';
import { ServiceSpecification } from './service.js';
import { Endpoint, EndpointEntityMap } from './endpoint.js';

/** Utility type to make working with the Endpoint map easier */
type ExtractEndpoint<Spec extends ServiceSpecification> =
  Spec['endpoint'] extends keyof EndpointEntityMap[Spec['endpointVersion']]
    ? EndpointEntityMap[Spec['endpointVersion']][Spec['endpoint']] extends Endpoint<any, any>
      ? EndpointEntityMap[Spec['endpointVersion']][Spec['endpoint']]
      : never
    : never;

/** Mapped index type of all specified service operations with their corresponding op function */
type ServiceOps<Spec extends ServiceSpecification> = {
  [Key in Spec['operations'][number]]: Spec['endpoint'] extends keyof EndpointEntityMap[Spec['endpointVersion']]
    ? ReturnType<typeof buildOp<ReturnType<typeof getOpMap<ExtractEndpoint<Spec>>>[Spec['endpointVersion']][Key]>>
    : never;
};

/** Mapped index type of all specified custom/overload service operations with their corresponding op function */
type ServiceCustomOps<Spec extends ServiceSpecification> = {
  [Key in keyof Spec['customOperations']]: Spec['customOperations'][Key] extends OpDef<any, any>
    ? ReturnType<typeof buildOp<Spec['customOperations'][Key]>>
    : never;
};

/** Mapped index type of all sub services defined on a provided {@link ServiceSpecification] */
type ServiceSubServices<Spec extends ServiceSpecification> = {
  [Key in keyof Spec['subService']]: Spec['subService'][Key] extends ServiceSpecification
    ? Service<Spec['subService'][Key]>
    : never;
};

/**
 * Service constructed from a provided {@link ServiceSpecification} consisting of
 * built operation methods and sub services
 */
type Service<Spec extends ServiceSpecification> = Omit<ServiceOps<Spec>, keyof ServiceCustomOps<Spec>> &
  ServiceCustomOps<Spec> &
  ServiceSubServices<Spec>;

export type SdkClient<T extends Record<string, ServiceSpecification>> = {
  [ServiceName in keyof T]: Service<T[ServiceName]>;
} & {
  fetch: Axios['request'];
  /**
   * The underlying settings for the SDK
   */
  config: Readonly<SDKConfig>;
};

export const DEFAULT_CONFIG = {
  baseUri: 'https://api.rotacloud.com',
  retry: RetryStrategy.Exponential,
} satisfies Partial<SDKConfig>;

/** Converts a provided {@see OperationContext} into a {@see Service} with all
 * associated types configured ready to be used by an end user of the SDK.
 *
 * The context object provided will be used as is for all operations on a service
 */
function serviceForContext<Spec extends ServiceSpecification>(opContext: OperationContext): Service<Spec> {
  const service = {};

  const opMap = getOpMap<ExtractEndpoint<Spec>>();
  for (const op of opContext.service.operations) {
    service[op] = buildOp(opContext, opMap[opContext.service.endpointVersion][op]);
  }
  for (const [customOpName, customOpFunc] of Object.entries(opContext.service.customOperations ?? {})) {
    service[customOpName] = buildOp(opContext, customOpFunc);
  }
  for (const [subServiceName, subServiceSpec] of Object.entries(opContext.service.subService ?? {})) {
    service[subServiceName] = serviceForContext({
      get client() {
        return opContext.client;
      },
      get request() {
        return opContext.request;
      },
      get sdkConfig() {
        return opContext.sdkConfig;
      },
      service: subServiceSpec,
    });
  }

  return service as Service<Spec>;
}

/** Builds the entire SDK client ready to be exported by the library and used by an end
 * user of the SDK
 */
export function createSdkClient<T extends Record<string, ServiceSpecification>>(
  serviceMap: T,
): (config: SDKConfig) => SdkClient<T> {
  return (sdkConfig: SDKConfig) => {
    let clientConfig = Object.freeze(defaultObject<SDKConfig>(sdkConfig, DEFAULT_CONFIG));
    let axiosClient = createCustomAxiosClient(clientConfig);
    let requestConfig = getBaseRequestConfig(clientConfig);

    const sdkClient = {
      fetch: (req) =>
        axiosClient.request({
          ...req,
          headers: {
            ...req.headers,
            ...requestConfig.headers,
          },
        }),
      get config() {
        return clientConfig;
      },
      set config(val: SDKConfig) {
        clientConfig = Object.freeze(defaultObject<SDKConfig>(val, DEFAULT_CONFIG));
        axiosClient = createCustomAxiosClient(clientConfig);
        requestConfig = getBaseRequestConfig(clientConfig);
      },
    } satisfies SdkClient<{}>;

    for (const [serviceName, serviceSpec] of Object.entries(serviceMap)) {
      sdkClient[serviceName] = serviceForContext({
        service: serviceSpec,
        // NOTE: using getters here to allow for changes after client creation
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        get client() {
          return axiosClient;
        },
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        get request() {
          return requestConfig;
        },
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        get sdkConfig() {
          return clientConfig;
        },
      });
    }

    // NOTE: guarantied to be safe due to the service iteration above
    return sdkClient as SdkClient<T>;
  };
}
