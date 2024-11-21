import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceSpecification } from './service.js';
import { RequestOptions, QueryParameterValue } from './fetchv2.js';
import { Endpoint, EndpointVersion } from './endpoint.js';

// TODO: should we add "upsert"?
/** Supported common operations */
export type Operation = 'get' | 'list' | 'listAll' | 'delete' | 'create' | 'update';
/** Context provided to all operations */
export type OperationContext = {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig<unknown>>;
  service: Readonly<ServiceSpecification>;
};

/** Defines the mapping between the data sent for a given request (e.g with
 * "POST" method) and the return type expected back
 *
 * NOTE: This is not type safe on purpose. There is no way to guarantee that a
 * given HTTP call will return a specific type in TS alone
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RequestConfig<RequestData, ResponseData> = AxiosRequestConfig<RequestData>;

/** Function to define an {@see OpFunction}
 *
 * This is intended as a convenient way of defining {@see OpFunction}s that can then be
 * "built" ready for the end user to call ({@see buildOp})
 * */
export type OpDef<T, P = any, O = unknown, R = T> =
  | ((ctx: OperationContext, param: P, opts?: RequestOptions<O>) => RequestConfig<T, R>)
  | ((ctx: OperationContext, param: P, opts?: RequestOptions<O>) => AsyncIterable<T>)
  | ((ctx: OperationContext, param: P, opts?: RequestOptions<O>) => Promise<T>);

/** Operation function type to be called by the end user of the SDK.
 *
 * All methods on services follow this typing
 * */
export type OpFunction<R = any, Param = unknown> = Param extends number
  ? {
      (id: Param): R;
      <F extends keyof Awaited<R>>(
        id: Param,
        options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<R>>,
      ): Promise<AxiosResponse<Pick<Awaited<R>, F>>>;
      <F extends keyof Awaited<R>>(
        id: Param,
        options: { fields: F[] } & RequestOptions<Awaited<R>>,
      ): Promise<Pick<Awaited<R>, F>>;
      (
        id: Param,
        opts?: {
          rawResponse: true;
        } & RequestOptions<Awaited<R>>,
      ): Promise<AxiosResponse<Awaited<R>>>;
      (id: Param, opts?: RequestOptions<Awaited<R>>): R;
    }
  : R extends AsyncIterable<infer U>
    ? // List based op parameter names
      {
        (query: Param): R;
        <F extends keyof U>(
          query: Param,
          options: { fields: F[] } & RequestOptions<U>,
        ): Promise<AsyncIterable<Pick<U, F>>>;
        (query: Param, opts?: RequestOptions<U>): R;
      }
    : // Entity based op parameter names
      {
        (entity: Param): R;
        <F extends keyof R>(
          entity: Param,
          options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<R>>,
        ): Promise<AxiosResponse<Pick<Awaited<R>, F>>>;
        <F extends keyof R>(
          entity: Param,
          options: { fields: F[] } & RequestOptions<Awaited<R>>,
        ): Promise<Pick<Awaited<R>, F>>;
        (
          entity: Param,
          opts?: {
            rawResponse: true;
          } & RequestOptions<Awaited<R>>,
        ): Promise<AxiosResponse<Awaited<R>>>;
        (entity: Param, opts?: RequestOptions<Awaited<R>>): R;
      };

/** Utility for creating a query params map needed by most API requests */
export function paramsFromOptions<T>(opts: RequestOptions<T>): Record<string, QueryParameterValue> {
  return {
    fields: opts?.fields,
    limit: opts?.maxResults,
    dry_run: opts?.dryRun,
  };
}

/** Converts a given `{@see AxiosRequestConfig}` into an iterable of paginated requests
 *
 * Utility for simplifying {@see listOp}
 */
function* requestPaginated<T>(
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

/** Operation for getting an entity */
function getOp<T = undefined>(ctx: OperationContext, id: number, opts?: RequestOptions<T>): RequestConfig<unknown, T> {
  return {
    ...ctx.request,
    method: 'GET',
    url: `${ctx.service.endpoint}/${id}`,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  };
}

/** Operation for creating an entity */
function createOp<T = unknown, NewEntity = unknown>(
  ctx: OperationContext,
  newEntity: NewEntity,
  opts?: RequestOptions<T>,
): RequestConfig<NewEntity, T> {
  return {
    ...ctx.request,
    method: 'POST',
    url: ctx.service.endpoint,
    data: newEntity,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  };
}

/** Operation for updating an entity */
function updateOp<Return, Entity extends { id: number } & Return>(
  ctx: OperationContext,
  entity: Entity,
  opts?: RequestOptions<Return>,
): RequestConfig<Entity, Return> {
  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpoint}/${entity.id}`,
    data: entity,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  };
}

/** Operation for deleting an entity */
function deleteOp<T = unknown>(
  ctx: OperationContext,
  id: number,
  opts?: RequestOptions<T>,
): RequestConfig<unknown, void> {
  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpoint}/${id}`,
    params: {
      ...ctx.request.params,
      ...paramsFromOptions(opts ?? {}),
    },
  };
}

/** Operation for listing all entities on an endpoint for a given query by
 * automatically handling pagination as and when needed
 */
async function* listOp<T, Query>(ctx: OperationContext, query: Query, opts?: RequestOptions<T[]>): AsyncGenerator<T> {
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

  for (const pagedRequest of requestPaginated(res, ctx.request)) {
    const pagedRes = await ctx.client.get<T[]>(ctx.service.endpoint, pagedRequest);
    yield* pagedRes.data;
  }
}

/** Operation for listing all entities on an endpoint for a given query as an array */
async function listAllOp<T, Query>(ctx: OperationContext, query: Query, opts?: RequestOptions<T[]>) {
  const results: T[] = [];
  for await (const entity of listOp<T, Query>(ctx, query, opts)) {
    results.push(entity);
  }
  return results;
}

/** Builds an {@see Op} definition into an {@see OpFunction} ready to be called
 * by the end user
 *
 * This will map typings and parameters defined on an {@see Op} into a more
 * convenient and type safe format for use by the end user
 */
export function buildOp<
  F extends OpDef<any>,
  Param = Parameters<F>[1],
  Return = ReturnType<F> extends RequestConfig<infer _, infer T> ? Promise<T> : ReturnType<F>,
>(ctx: OperationContext, opFunc: F): OpFunction<Return, Param>;
export function buildOp<
  F extends OpDef<any>,
  Param = Parameters<F>[1],
  Return = ReturnType<F> extends RequestConfig<infer _, infer T> ? Promise<T> : ReturnType<F>,
>(ctx: OperationContext, opFunc: F) {
  return (param: Param, opts?: Parameters<F>[2]) => {
    const req = opFunc(ctx, param, opts);
    if (Symbol.asyncIterator in req) {
      return req;
    }

    if (req instanceof Promise || ('then' in req && typeof req.then === 'function')) {
      return req;
    }

    return ctx.client.request<Return>(req).then((res) => {
      if (opts?.rawResponse) return res;
      return res.data;
    });
  };
}

/** Function to return type safe mapping between a given endpoint; endpoint
 * version and a common "op"
 *
 * NOTE: This is a function rather than a constant so that type generics work as
 * intended. It's currently not possible to define a constant with generics
 */
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
  } satisfies Record<EndpointVersion, Record<Operation, OpDef<any, any>>>;
}
