import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { assert } from 'console';
import { ServiceSpecification } from './service.js';
import { Options, ParameterValue } from './fetchv2.js';
import { Endpoint, EndpointVersion } from './endpoint.js';

// TODO: investigate sets of operations e.g. "read-only" grants "list" and "get"
// TODO: should we add "upsert"?
export type Operation = 'get' | 'list' | 'listAll' | 'delete' | 'create' | 'update';
export type OpFactoryOptions = {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig<unknown>>;
  service: Readonly<ServiceSpecification>;
};

export type OpFunction<Entity = any, Param = unknown, R = Entity> = {
  (param: Param): Promise<R>;
  <T = Entity>(
    param: Param,
    opts?: {
      rawResponse: true;
    } & Options<T>,
  ): Promise<AxiosResponse<Entity>>;
  <T = Entity>(param: Param, opts?: Options<T>): Promise<R>;
  <T extends Array<any>>(query: Param, opts?: Options<T>): Promise<R>;
};

type OpFactoryEntity = {
  // Single param
  <T, R = T>(factoryOpts: OpFactoryOptions): (id: number) => Promise<R>;
  <T, R = T>(factoryOpts: OpFactoryOptions): (entity: T) => Promise<R>;

  // Raw response enabled
  <T, R>(
    factoryOpts: OpFactoryOptions,
  ): (
    id: number,
    opts: {
      rawResponse: true;
    } & Options<T>,
  ) => Promise<AxiosResponse<R>>;
  <T, R = T, PartialT extends Partial<PartialT> = Partial<T>>(
    factoryOpts: OpFactoryOptions,
  ): (
    entity: PartialT,
    opts: {
      rawResponse: true;
    } & Options<T>,
  ) => Promise<AxiosResponse<R>>;
  <T, R = T>(
    factoryOpts: OpFactoryOptions,
  ): (
    entity: T,
    opts: {
      rawResponse: true;
    } & Options<T>,
  ) => Promise<AxiosResponse<R>>;

  // Raw response disabled
  <T, R = T>(factoryOpts: OpFactoryOptions): (id: number, opts?: Options<T>) => Promise<R>;
  <T, R = T, PartialT extends Partial<T> = Partial<T>>(
    factoryOpts: OpFactoryOptions,
  ): (entity: PartialT, opts?: Options<T>) => Promise<R>;
  <T, R = T>(factoryOpts: OpFactoryOptions): (entity: T, opts?: Options<T>) => Promise<R>;
};

type OpFactoryQuery = {
  <T, Q>(factoryOpts: OpFactoryOptions): (query: Q, opts?: Exclude<Options<T[]>, 'rawResponse'>) => AsyncGenerator<T>;
  <T, Q>(factoryOpts: OpFactoryOptions): (query: Q, opts?: Exclude<Options<T[]>, 'rawResponse'>) => Promise<T[]>;
};

export type OpFactory = OpFactoryEntity | OpFactoryQuery;

export function paramsFromOptions<T>(opts: Options<T>): Record<string, ParameterValue> {
  return {
    // fields: opts?.fields,
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

function getOp<Entity>({ client, request, service }: OpFactoryOptions): OpFunction<Entity, number> {
  return async <T = Entity>(id: number, opts?: Options<T>) => {
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

function createOp<Entity, PartialEntity>({ client, request, service }: OpFactoryOptions): OpFunction<Entity> {
  return async <T = Entity, R = PartialEntity>(newEntity: R, opts?: Options<T>) => {
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

function updateOp<Entity extends { id: number }>({ client, request, service }: OpFactoryOptions): OpFunction<Entity> {
  return async <T extends { id: number } = Entity>(entity: T, opts?: Options<T>) => {
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

function deleteOp<Entity>({ client, request, service }: OpFactoryOptions): OpFunction<Entity, number, void> {
  return async <T = Entity, R = void>(id: number, opts?: Options<T>) => {
    const paramAppliedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
      },
    };
    const res = await client.delete<R>(`${service.endpoint}/${id}`, paramAppliedRequest);
    if (opts?.rawResponse) return res;
    return res.data;
  };
}

function listOp<Entity, Query>({ client, request, service }: OpFactoryOptions) {
  return async function* list<T = Entity>(
    query: Query,
    opts?: Exclude<Options<T[]>, 'rawResponse'>,
  ): AsyncGenerator<T> {
    const queriedRequest = {
      ...request,
      params: {
        ...request.params,
        ...paramsFromOptions(opts ?? {}),
        ...query,
      },
    };
    const res = await client.get<T[]>(service.endpoint, queriedRequest);
    yield* res.data;

    for (const pagedRequest of pagedParams(res, request)) {
      const pagedRes = await client.get<T[]>(service.endpoint, pagedRequest);
      yield* pagedRes.data;
    }
  };
}

function listAllOp<Entity, Query>({ client, request, service }: OpFactoryOptions) {
  return async <T = Entity, Q = Query>(query: Q, opts?: Exclude<Options<T[]>, 'rawResponse'>) => {
    const results: T[] = [];
    for await (const entity of listOp<T, Q>({ client, request, service })(query, opts)) {
      results.push(entity);
    }
    return results;
  };
}

export function getOpMap<E extends Endpoint, T extends E['type'] = E['type']>() {
  return {
    v1: {
      get: getOp<T>,
      delete: deleteOp<T>,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
      create: createOp<E['createType'], T>,
      update: updateOp<T extends { id: number } ? T : never>,
    },
    v2: {
      get: getOp<T>,
      delete: deleteOp<T>,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<E['queryParameters'], T>,
      create: createOp<E['createType'], T>,
      update: updateOp<T extends { id: number } ? T : never>,
    },
  } satisfies Record<EndpointVersion, Record<Operation, OpFactory | typeof listOp | typeof listAllOp>>;
}
