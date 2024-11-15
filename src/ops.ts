import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { assert } from 'console';
import { Endpoint, EndpointVersion, ServiceSpecification } from './service.js';
import { Options, ParameterValue } from './fetchv2.js';

// TODO: investigate sets of operations e.g. "read-only" grants "list" and "get"
// TODO: should we add "upsert"?
export type Operation = 'get' | 'list' | 'listAll' | 'delete' | 'create' | 'update';
type OpFactoryOptions = {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig<unknown>>;
  service: Readonly<ServiceSpecification>;
};

export type OpFunctionFactory<T extends (...args: any[]) => Promise<unknown> = () => Promise<unknown>> = (
  opts: OpFactoryOptions,
) => T;

function paramsFromOptions<T>(opts: Options<T>): Record<string, ParameterValue> {
  return {
    fields: opts?.fields,
    limit: opts?.maxResults,
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
function getOp<T>({ client, request, service }: OpFactoryOptions): (id: number, opts?: Options<T>) => Promise<T>;
function getOp<T>({ client, request, service }: OpFactoryOptions) {
  return async (id: number, opts?: Options<T>) => {
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

function createOp<T>({ client, request, service }: OpFactoryOptions): (newEntity: T) => Promise<T>;
function createOp<T>({
  client,
  request,
  service,
}: OpFactoryOptions): (newEntity: T, opts: { rawResponse: true }) => Promise<AxiosResponse<T>>;
function createOp<T>({ client, request, service }: OpFactoryOptions): (newEntity: T, opts?: Options<T>) => Promise<T>;
function createOp<T>({ client, request, service }: OpFactoryOptions) {
  return async (newEntity: T, opts?: Options<T>) => {
    const paramAppliedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
      },
    };
    const res = await client.post<T>(service.endpoint, newEntity, paramAppliedRequest);
    if (opts?.rawResponse) return res;
    return res.data;
  };
}

function updateOp<T extends { id: number }>({ client, request, service }: OpFactoryOptions): (entity: T) => Promise<T>;
function updateOp<T extends { id: number }>({
  client,
  request,
  service,
}: OpFactoryOptions): (entity: T, opts: { rawResponse: true }) => Promise<AxiosResponse<T>>;
function updateOp<T extends { id: number }>({
  client,
  request,
  service,
}: OpFactoryOptions): (entity: T, opts?: Options<T>) => Promise<T>;
function updateOp<T extends { id: number }>({ client, request, service }: OpFactoryOptions) {
  return async (entity: T, opts?: Options<T>) => {
    assert(typeof entity.id === 'number', 'Entity must already exist with a valid ID');
    const paramAppliedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
      },
    };
    const res = await client.post<T>(`${service.endpoint}/${entity.id}`, entity, paramAppliedRequest);
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
function deleteOp({
  client,
  request,
  service,
}: OpFactoryOptions): (id: number, opts?: Options<unknown>) => Promise<void>;
function deleteOp({ client, request, service }: OpFactoryOptions) {
  return async (id: number, opts?: Options<unknown>) => {
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
}: OpFactoryOptions): (query: Q, opts?: Exclude<Options<T[]>, 'rawResponse'>) => AsyncGenerator<T>;
function listOp<T, Q>({ client, request: requestConfig, service }: OpFactoryOptions) {
  return async function* list(query: Q, opts?: Options<T[]>) {
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
  return async (query: Q, opts?: Exclude<Options<T[]>, 'rawResponse'>) => {
    const results: T[] = [];
    for await (const entity of listOp<T, Q>({ client, request: requestConfig, service })(query, opts)) {
      results.push(entity);
    }
    return results;
  };
}

interface OpFunctionMap<T> extends Record<Operation, OpFunctionFactory<any>> {
  get: OpFunctionFactory<(id: number, opts?: Options<T[]>) => Promise<T>>;
  delete: OpFunctionFactory<(id: number, opts?: Options<T[]>) => Promise<void>>;
  listAll: OpFunctionFactory<(query: any, opts?: Options<T[]>) => Promise<T[]>>;
}

export function getOpMap<E extends Endpoint, T extends E['type'] = E['type']>() {
  return {
    v1: {
      get: getOp<T>,
      delete: deleteOp,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
      create: createOp<E['requirementsType']>,
      update: updateOp<T extends { id: number } ? T : never>,
    },
    v2: {
      get: getOp<T>,
      delete: deleteOp,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
      create: createOp<E['requirementsType']>,
      update: updateOp<T extends { id: number } ? T : never>,
    },
  } satisfies Record<EndpointVersion, OpFunctionMap<T>>;
}
