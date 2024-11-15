import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Endpoint, EndpointVersion, ServiceSpecification } from './service.js';
import { Options, OptionsExtended } from './services/service.js';
import { ParameterValue } from './fetchv2.js';

// TODO: investigate sets of operations e.g. "read-only" grants "list" and "get"
export type Operation = 'get' | 'list' | 'listAll' | 'delete';

export type OpFunctionFactory<T extends (...args: any[]) => Promise<unknown> = () => Promise<unknown>> = (opts: {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig<Awaited<ReturnType<T>>>>;
  service: ServiceSpecification;
}) => T;

type OpFactoryOptions = {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig<unknown>>;
  service: Readonly<ServiceSpecification>;
};

function paramsFromOptions(opts: OptionsExtended): Record<string, ParameterValue> {
  return {
    fields: opts?.fields,
    limit: opts?.limit,
    offset: opts?.offset,
    dry_run: opts?.dryRun,
  };
}

function* pagedParams<T>(
  response: AxiosResponse<T>,
  requestConfig: AxiosRequestConfig<T>,
): Generator<AxiosRequestConfig<T>> {
  const fallbackLimit = 20;
  const limit = Number(response.headers?.['x-limit']) || fallbackLimit;
  const entityCount = Number(response.headers?.['x-total-count']) || 0;
  const requestOffset = Number(response.headers?.['x-offset']) || 0;

  for (let offset = requestOffset + limit; offset < entityCount; offset += limit) {
    yield {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        limit,
        offset,
        exclude_link_header: true,
      },
    };
  }
}

function getOp<T>({ client, request, service }: OpFactoryOptions): (id: number) => Promise<T>;
function getOp<T>({
  client,
  request,
  service,
}: OpFactoryOptions): (id: number, opts: { rawResponse: true }) => Promise<AxiosResponse<T>>;
function getOp<T>({ client, request, service }: OpFactoryOptions): (id: number, opts?: Options) => Promise<T>;
function getOp<T>({ client, request, service }: OpFactoryOptions) {
  return async (id: number, opts?: Options) => {
    const paramAppliedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
      },
    };
    const res = await client.get<T>(`${service.endpoint}/${id}`, paramAppliedRequest);
    if (opts?.rawResponse) return res;
    return res.data;
  };
}

function deleteOp({ client, request, service }: OpFactoryOptions): (id: number) => Promise<void>;
function deleteOp({
  client,
  request,
  service,
}: OpFactoryOptions): (id: number, opts: { rawResponse: true }) => Promise<AxiosResponse<void>>;
function deleteOp({ client, request, service }: OpFactoryOptions): (id: number, opts?: Options) => Promise<void>;
function deleteOp({ client, request, service }: OpFactoryOptions) {
  return async (id: number, opts?: Options) => {
    const paramAppliedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
      },
    };
    const res = await client.delete(`${service.endpoint}/${id}`, paramAppliedRequest);
    if (opts?.rawResponse) return res;
    return res.data;
  };
}

function listOp<T, Q>({
  client,
  request,
  service,
}: OpFactoryOptions): (query: Q, opts?: Exclude<Options, 'rawResponse'>) => AsyncGenerator<T>;
function listOp<T, Q>({ client, request: requestConfig, service }: OpFactoryOptions) {
  return async function* list(query: Q, opts?: Options) {
    const queriedRequest = {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        ...paramsFromOptions(opts ?? {}),
        ...query,
      },
    };
    const res = await client.get<T[]>(service.endpoint, queriedRequest);
    yield* res.data;

    for (const pagedRequest of pagedParams(res, requestConfig)) {
      const pagedRes = await client.get<T[]>(service.endpoint, pagedRequest);
      yield* pagedRes.data;
    }
  };
}

function listAllOp<T, Q>({ client, request: requestConfig, service }: OpFactoryOptions) {
  return async (query: Q, opts?: Exclude<Options, 'rawResponse'>) => {
    const results: T[] = [];
    for await (const entity of listOp<T, Q>({ client, request: requestConfig, service })(query, opts)) {
      results.push(entity);
    }
    return results;
  };
}

interface OpFunctionMap<T> extends Record<Operation, OpFunctionFactory<any>> {
  get: OpFunctionFactory<(id: number, opts?: Options) => Promise<T>>;
  delete: OpFunctionFactory<(id: number, opts?: Options) => Promise<void>>;
  listAll: OpFunctionFactory<(query: any, opts?: Options) => Promise<T[]>>;
}

export function getOpMap<E extends Endpoint, T extends E['type'] = E['type']>() {
  return {
    v1: {
      get: getOp<T>,
      delete: deleteOp,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
    },
    v2: {
      get: getOp<T>,
      delete: deleteOp,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
    },
  } satisfies Record<EndpointVersion, OpFunctionMap<T>>;
}
