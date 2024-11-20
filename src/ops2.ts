import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
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
  (entity: Param): Promise<R>;
  <T = Entity>(
    entity: Param,
    opts?: {
      rawResponse: true;
    } & Options<T>,
  ): Promise<AxiosResponse<Entity>>;

  <T = Entity>(entity: Param, opts?: Options<T>): Promise<R>;

  <T extends Array<any>>(query: Param, opts?: Options<T>): Promise<R>;
};

export function paramsFromOptions<T>(opts: Options<T>): Record<string, ParameterValue> {
  return {
    // fields: opts?.fields,
    limit: opts?.maxResults,
    dry_run: opts?.dryRun,
  };
}

export type Op<T, P> =
  | ((ctx: OpFactoryOptions, param: P, opts?: Options<T>) => AxiosRequestConfig<T>)
  | ((ctx: OpFactoryOptions, param: P, opts?: Options<T[]>) => AsyncIterable<T>)
  | ((ctx: OpFactoryOptions, param: P, opts?: Options<T>) => Promise<T>);

export type BuiltOp<O extends Op<any, any>> = (
  param: Parameters<O>[1],
  opts?: Parameters<O>[2],
) => ReturnType<O> extends AxiosRequestConfig<infer T> ? OpFunction<T> : ReturnType<O>;

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

function getOp<T = undefined>(ctx: OpFactoryOptions, id: number, opts?: Options<T>): AxiosRequestConfig<T> {
  return {
    ...ctx.request,
    method: 'GET',
    url: `${ctx.service.endpoint}/${id}`,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  } as AxiosRequestConfig<T>;
}

function createOp<T = unknown, NewEntity = unknown>(
  ctx: OpFactoryOptions,
  newEntity: NewEntity,
  opts?: Options<T>,
): AxiosRequestConfig<T> {
  return {
    ...ctx.request,
    method: 'POST',
    url: ctx.service.endpoint,
    data: newEntity,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  } as AxiosRequestConfig<T>;
}

function updateOp<Return, Entity extends { id: number } & Return>(
  ctx: OpFactoryOptions,
  entity: Entity,
  opts?: Options<Return>,
): AxiosRequestConfig<Return> {
  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpoint}/${entity.id}`,
    data: entity,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  } as AxiosRequestConfig<Return>;
}

function deleteOp<T = unknown>(ctx: OpFactoryOptions, id: number, opts?: Options<T>): AxiosRequestConfig<void> {
  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpoint}/${id}`,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  } as AxiosRequestConfig<void>;
}

async function* listOp<T, Query>(ctx: OpFactoryOptions, query: Query, opts?: Options<T[]>): AsyncGenerator<T> {
  const queriedRequest = {
    ...ctx.request,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
      ...query,
    },
  };
  const res = await ctx.client.get<T[]>(ctx.service.endpoint, queriedRequest);
  yield* res.data;

  for (const pagedRequest of pagedParams(res, ctx.request)) {
    const pagedRes = await ctx.client.get<T[]>(ctx.service.endpoint, pagedRequest);
    yield* pagedRes.data;
  }
}

async function listAllOp<T, Query>(ctx: OpFactoryOptions, query: Query, opts?: Options<T[]>) {
  const results: T[] = [];
  for await (const entity of listOp<T, Query>(ctx, query, opts)) {
    results.push(entity);
  }
  return results;
}

// : ReturnType<F> extends AxiosRequestConfig<infer T> ? OpFunction<T, Param> : OpFunction<ReturnType<F>, Param>
export function buildOp<F extends Op<any, any>, Param = Parameters<F>[1]>(
  ctx: OpFactoryOptions,
  opFunc: F,
): OpFunction<ReturnType<F> extends AxiosRequestConfig<infer T> ? T : ReturnType<F>, Parameters<F>[1]> {
  return async <T = ReturnType<F>, P = Param>(param: P, opts?: Parameters<F>[2]) => {
    const req = opFunc(ctx, param, opts);
    if (Symbol.asyncIterator in req) {
      return req;
    }

    if (req instanceof Promise || ('then' in req && typeof req.then === 'function')) {
      return req;
    }

    const res = await ctx.client.request<T>(req);
    if (opts?.rawResponse) return res;
    return res.data;
  };
}

const options = {} as unknown as OpFactoryOptions;

const get = buildOp(options, getOp<number>);
const list = buildOp(options, listOp<any, unknown>);
const res = await get(1, { rawResponse: true });

export function getOpMap<E extends Endpoint, T extends E['type'] = E['type']>() {
  return {
    v1: {
      get: getOp<T>,
      delete: deleteOp<T>,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
      create: createOp<E['createType'], T>,
      update: updateOp<T, T extends { id: number } ? T : never>,
    },
    v2: {
      get: getOp<T>,
      delete: deleteOp<T>,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<E['queryParameters'], T>,
      create: createOp<E['createType'], T>,
      update: updateOp<T, T extends { id: number } ? T : never>,
    },
  } satisfies Record<EndpointVersion, Record<Operation, Op<any, any>>>;
}
