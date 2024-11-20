import { Axios, AxiosRequestConfig } from 'axios';
import { createCustomAxiosClient, getBaseRequestConfig } from './fetchv2.js';
import { SDKConfig } from './interfaces/index.js';
import { buildOp, BuiltOp, getOpMap, Op } from './ops2.js';
import { ServiceSpecification } from './service.js';
import { Endpoint, EndpointEntityMap } from './endpoint.js';

/** Utility type to make working with the Endpoint map easier */
type ExtractEndpoint<Spec extends ServiceSpecification> =
  Spec['endpoint'] extends keyof EndpointEntityMap[Spec['endpointVersion']]
    ? EndpointEntityMap[Spec['endpointVersion']][Spec['endpoint']] extends Endpoint
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
  [Key in keyof Spec['customOperations']]: Spec['customOperations'][Key] extends Op<any, any>
    ? BuiltOp<Spec['customOperations'][Key]>
    : never;
};
type Service<Spec extends ServiceSpecification> = Omit<ServiceOps<Spec>, keyof ServiceCustomOps<Spec>> &
  ServiceCustomOps<Spec>;

export type SdkClient<T extends Record<string, ServiceSpecification>> = {
  [ServiceName in keyof T]: Service<T[ServiceName]>;
} & {
  fetch: Axios['get'];
  config: (() => SDKConfig) & {
    set: () => void;
  };
};

function serviceForSpec<Spec extends ServiceSpecification>(
  serviceSpec: Spec,
  opts: { axiosClient: Axios; axiosConfig: Readonly<AxiosRequestConfig> },
): Service<Spec> {
  const service = {};

  const opMap = getOpMap<ExtractEndpoint<Spec>>();
  for (const op of serviceSpec.operations) {
    service[op] = buildOp(
      {
        client: opts.axiosClient,
        request: opts.axiosConfig,
        service: serviceSpec,
      },
      opMap[serviceSpec.endpointVersion][op],
    );
  }
  for (const [customOpName, customOpFunc] of Object.entries(serviceSpec.customOperations ?? {})) {
    service[customOpName] = customOpFunc;
  }

  return service as Service<Spec>;
}

export function createSdkClient<T extends Record<string, ServiceSpecification>>(
  serviceMap: T,
): (config: SDKConfig) => SdkClient<T> {
  return (sdkConfig: SDKConfig) => {
    const axiosClient = createCustomAxiosClient(sdkConfig);
    const config = (): SDKConfig => sdkConfig;
    // TODO: setup setter here - proxy?
    config.set = () => {};

    const sdkClient = {
      fetch: axiosClient.get,
      config,
    };

    const requestConfig = getBaseRequestConfig(sdkConfig);
    for (const [serviceName, serviceSpec] of Object.entries(serviceMap)) {
      sdkClient[serviceName] = serviceForSpec(serviceSpec, {
        axiosClient,
        get axiosConfig() {
          return requestConfig;
        },
      });
    }

    // NOTE: guarantied to be safe due to the service iteration above
    return sdkClient as SdkClient<T>;
  };
}
