import { Axios, AxiosRequestConfig } from 'axios';
import { createCustomAxiosClient, getBaseRequestConfig } from './fetchv2';
import { SDKConfig, Shift } from './interfaces';
import { Options } from '../dist/cjs/services';

// NOTE: TYPES
// TODO: investigate sets of operations e.g. "read-only" grants "list" and "get"
type Operation = 'get' | 'list' | 'delete';
type EndpointVersion = 'v1' | 'v2';

/** Mapping between a endpoint URL and it's associated entity type */
interface EndpointEntityMap extends Record<EndpointVersion, Record<string, unknown>> {
  /** Type mappings for v1 endpoints  */
  v1: {
    shifts: Shift;
    timezones: { id: number; name: string; version: 'v1' };
  };
  /** Type mappings for v2 endpoints */
  v2: {
    shifts: { id: number; user: number; version: 'v2' };
  };
}

type OpFunction<T extends (...args: any[]) => Promise<unknown> = () => Promise<unknown>> = (opts: {
  client: Readonly<Axios>;
  requestConfig: Readonly<AxiosRequestConfig<Awaited<ReturnType<T>>>>;
  service: ServiceSpecification;
}) => T;

export type ServiceSpecification =
  | {
      endpoint: keyof EndpointEntityMap['v1'];
      endpointVersion: 'v1';
      operations: Operation[];
      customOperations?: Record<string, OpFunction>;
    }
  | {
      endpoint: keyof EndpointEntityMap['v2'];
      endpointVersion: 'v2';
      operations: Operation[];
      customOperations?: Record<string, OpFunction>;
    };

interface OpFunctionMap<T> extends Record<Operation, OpFunction<any>> {
  get: OpFunction<(id: number, opts?: Options) => Promise<T>>;
  list: OpFunction<(query: any, opts?: Options) => Promise<T[]>>;
  delete: OpFunction<(id: number, opts?: Options) => Promise<void>>;
}

function getOpMap<T>() {
  return {
    v1: {
      get:
        ({ client, requestConfig, service }) =>
        async (id, opts?) => {
          const res = await client.request<T>({ ...requestConfig, url: `${service.endpoint}/${id}` });
          // if (opts.rawResponse) return res;
          return res.data;
        },
      list:
        ({ client, requestConfig }) =>
        async (query: { start_time: string }, opts?) => {
          const res = await client.request<T[]>(requestConfig);
          // if (opts.rawResponse) return res;
          return res.data;
        },
      delete:
        ({ client, requestConfig }) =>
        async (id, opts?) => {
          await client.request<T>(requestConfig);
        },
    },
    v2: {
      get:
        ({ client, requestConfig }) =>
        async (id, opts?) => {
          const res = await client.request<T>(requestConfig);
          // if (opts.rawResponse) return res;
          return res.data;
        },
      list:
        ({ client, requestConfig }) =>
        async (query: { startTime: string }, opts?) => {
          const res = await client.request<T[]>(requestConfig);
          // if (opts.rawResponse) return res;
          return res.data;
        },
      delete:
        ({ client, requestConfig }) =>
        async (id, opts?) => {
          await client.request<T>(requestConfig);
        },
    },
  } satisfies Record<EndpointVersion, OpFunctionMap<T>>;
}

/** Mapped index type of all specified service operations with their corresponding function */
type ServiceOps<Spec extends ServiceSpecification> = {
  [Key in Spec['operations'][number]]: Spec['endpoint'] extends keyof EndpointEntityMap[Spec['endpointVersion']]
    ? ReturnType<
        ReturnType<
          typeof getOpMap<EndpointEntityMap[Spec['endpointVersion']][Spec['endpoint']]>
        >[Spec['endpointVersion']][Key]
      >
    : never;
};
type ServiceCustomOps<Spec extends ServiceSpecification> = {
  [Key in keyof Spec['customOperations']]: Spec['customOperations'][Key] extends OpFunction
    ? ReturnType<Spec['customOperations'][Key]>
    : never;
};
type Service<Spec extends ServiceSpecification> = Omit<ServiceOps<Spec>, keyof ServiceCustomOps<Spec>> &
  ServiceCustomOps<Spec>;

function serviceForSpec<Entity, Spec extends ServiceSpecification>(
  serviceSpec: Spec,
  opts: { axiosClient: Axios; axiosConfig: Readonly<AxiosRequestConfig> },
): Service<Spec> {
  const service = {};

  const opMap = getOpMap<Entity>();
  for (const op of serviceSpec.operations) {
    service[op] = opMap[serviceSpec.endpointVersion][op]({
      client: opts.axiosClient,
      requestConfig: opts.axiosConfig,
      service: serviceSpec,
    });
  }
  for (const [customOpName, customOpFunc] of Object.entries(serviceSpec.customOperations ?? {})) {
    service[customOpName] = customOpFunc;
  }

  return service as Service<Spec>;
}

type SdkClient<T extends Record<string, ServiceSpecification>> = {
  [ServiceName in keyof T]: Service<T[ServiceName]>;
} & {
  fetch: Axios['get'];
  config: (() => SDKConfig) & {
    set: () => void;
  };
};
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

    // NOTE: guarenteed to be safe due to the service iteration above
    return sdkClient as SdkClient<T>;
  };
}
