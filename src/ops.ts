import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceSpecification } from './service.js';
import { RequestOptions, QueryParameterValue, RequirementsOf, assert } from './utils.js';
import { Endpoint, EndpointVersion } from './endpoint.js';
import { SDKConfig } from './main.js';

/** Supported common operations */
export type Operation =
  | 'get'
  | 'list'
  | 'listAll'
  | 'listByPage'
  | 'delete'
  | 'deleteBatch'
  | 'create'
  | 'update'
  | 'updateBatch';
/** Context provided to all operations */
export type OperationContext = {
  client: Readonly<Axios>;
  request: Readonly<AxiosRequestConfig>;
  service: Readonly<ServiceSpecification>;
  sdkConfig: Readonly<SDKConfig>;
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
export type OpDef<T, Param = any, Opts extends Partial<RequestOptions<any>> = RequestOptions<unknown>, Return = T> =
  | ((ctx: OperationContext, param: Param, opts?: Opts) => RequestConfig<T, Return>)
  | ((ctx: OperationContext, param: Param, opts?: Opts) => AsyncIterable<T>)
  | ((ctx: OperationContext, param: Param, opts?: Opts) => Promise<T>);

/** Operation function type to be called by the end user of the SDK.
 *
 * All methods on services follow this typing
 * */
export type OpFunction<R = any, Param = undefined, Opts = RequestOptions<unknown>> = R extends
  | AsyncIterable<infer U>
  | Promise<Iterable<infer U>>
  ? // List based op parameter names
    Param extends undefined
    ? {
        (query?: Param): R;
        <F extends keyof U>(
          query: Param,
          options: { fields: F[] } & RequestOptions<U>,
        ): R extends AsyncIterable<U>
          ? Promise<AsyncIterable<Pick<U, F>>>
          : R extends Promise<Array<U>>
            ? Promise<Array<Pick<U, F>>>
            : Promise<Iterable<Pick<U, F>>>;
        (query: Param, options?: Opts): R;
      }
    : Partial<Param> extends Param
      ? {
          (query?: Param): R;
          <F extends keyof U>(
            query: Param,
            options: { fields: F[] } & RequestOptions<U>,
          ): R extends AsyncIterable<U>
            ? Promise<AsyncIterable<Pick<U, F>>>
            : R extends Promise<Array<U>>
              ? Promise<Array<Pick<U, F>>>
              : Promise<Iterable<Pick<U, F>>>;
          (query?: Param, options?: Opts): R;
        }
      : {
          (query: Param): R;
          <F extends keyof U>(
            query: Param,
            options: { fields: F[] } & RequestOptions<U>,
          ): R extends AsyncIterable<U>
            ? Promise<AsyncIterable<Pick<U, F>>>
            : R extends Promise<Array<U>>
              ? Promise<Array<Pick<U, F>>>
              : Promise<Iterable<Pick<U, F>>>;
          (query: Param, Options?: Opts): R;
        }
  : Param extends number
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
          options?: {
            rawResponse: true;
          } & RequestOptions<Awaited<R>>,
        ): Promise<AxiosResponse<Awaited<R>>>;
        (id: Param, options?: RequestOptions<Awaited<R>>): R;
      }
    : Param extends undefined
      ? {
          (entity?: Param): R;
          <F extends keyof Awaited<R>>(
            entity: Param,
            options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<R>>,
          ): Promise<AxiosResponse<Pick<Awaited<R>, F>>>;
          <F extends keyof Awaited<R>>(
            entity: Param,
            options: { fields: F[] } & RequestOptions<Awaited<R>>,
          ): Promise<Pick<Awaited<R>, F>>;
          (
            entity?: Param,
            options?: {
              rawResponse: true;
            } & RequestOptions<Awaited<R>>,
          ): Promise<AxiosResponse<Awaited<R>>>;
          (entity?: Param, options?: RequestOptions<Awaited<R>>): R;
        }
      : // Entity based op parameter names
        {
          (entity: Param): R;
          <F extends keyof Awaited<R>>(
            entity: Param,
            options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<R>>,
          ): Promise<AxiosResponse<Pick<Awaited<R>, F>>>;
          <F extends keyof Awaited<R>>(
            entity: Param,
            options: { fields: F[] } & RequestOptions<Awaited<R>>,
          ): Promise<Pick<Awaited<R>, F>>;
          (
            entity: Param,
            options?: {
              rawResponse: true;
            } & RequestOptions<Awaited<R>>,
          ): Promise<AxiosResponse<Awaited<R>>>;
          (entity: Param, options?: RequestOptions<Awaited<R>>): R;
        };

/** Wrapper type for expressing the response returned by a v2 list op supported endpoint */
interface PagedResponse<T> {
  /** List of entities in a page */
  data: T[];
  /** Metadata about the current page */
  pagination: {
    /**
     * The "cursor" for the next page where `null` means there is no next page
     *
     * Used as a value to the query parameter `cursor` in a supported endpoint
     */
    next: string | null;
    /** Total count of entities matching the list query */
    count: number;
  };
}

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
function getOp<T = undefined>(ctx: OperationContext, id: number): RequestConfig<unknown, T> {
  return {
    ...ctx.request,
    method: 'GET',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${id}`,
  };
}

/** Operation for creating an entity */
function createOp<T = unknown, NewEntity = unknown>(
  ctx: OperationContext,
  newEntity: NewEntity,
): RequestConfig<NewEntity, T> {
  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    data: newEntity,
  };
}

/** Operation for updating an entity */
function updateOp<Return, Entity extends { id: number } & Partial<Return>>(
  ctx: OperationContext,
  entity: Entity,
): RequestConfig<Entity, Return> {
  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${entity.id}`,
    data: entity,
  };
}

/** Operation for deleting a list of entities */
async function updateBatchOp<Return, Entity extends { id: number } & Partial<Return>>(
  ctx: OperationContext,
  entities: Entity[],
): Promise<{ success: Return[]; failed: { id: number; error: string }[] }> {
  const res = await ctx.client.request<{ code: number; data?: Return; error?: string }[]>({
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    data: entities,
  });

  return res.data.reduce(
    (acc, entityRes, shiftIdx) => {
      if (entityRes.error) {
        acc.failed.push({ id: entities[shiftIdx].id, error: entityRes.error });
      } else if (entityRes.data) {
        acc.success.push(entityRes.data);
      }
      return acc;
    },
    { success: [] as Return[], failed: [] as { id: number; error: string }[] },
  );
}

/** Operation for deleting an entity */
function deleteOp(ctx: OperationContext, id: number): RequestConfig<unknown, void> {
  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${id}`,
  };
}

/** Operation for deleting a list of entities */
function deleteBatchOp(ctx: OperationContext, ids: number[]): RequestConfig<unknown, void> {
  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    data: ids,
  };
}

/** Operation for listing all entities on a v1 endpoint for a given query by
 * automatically handling pagination as and when needed
 */
export async function* listOp<T, Query>(
  ctx: OperationContext,
  query: Query,
  // NOTE: offset is only supported in v1
  opts?: RequestOptions<T[]> & { offset?: number },
): AsyncGenerator<T> {
  const queriedRequest = {
    ...ctx.request,
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    params: {
      ...ctx.request.params,
      ...query,
      offset: opts?.offset,
    },
  };
  const res = await ctx.client.request<T[]>(queriedRequest);
  const maxEntities = opts?.maxResults ?? Infinity;
  let entityCount = res.data.length;

  assert(Array.isArray(res.data), 'list can only be performed on endpoints returning an array');
  yield* res.data.slice(0, maxEntities);
  if (entityCount >= maxEntities) return;

  for (const pagedRequest of requestPaginated(res, queriedRequest)) {
    const pagedRes = await ctx.client.request<T[]>(pagedRequest);
    for (const entity of pagedRes.data) {
      yield entity;
      entityCount += 1;
      if (entityCount >= maxEntities) return;
    }
  }
}

/** Operation for listing all entities on a v2 endpoint for a given query by
 * automatically handling pagination as and when needed
 */
export async function* listV2Op<T, Query>(
  ctx: OperationContext,
  query: Query,
  opts?: RequestOptions<T[]>,
): AsyncGenerator<T> {
  const queriedRequest = {
    ...ctx.request,
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    params: {
      ...ctx.request.params,
      ...query,
      limit: opts?.maxResults,
    },
  };
  const res = await ctx.client.request<PagedResponse<T>>(queriedRequest);
  const { data: entities, pagination } = res.data;
  const maxEntities = opts?.maxResults ?? Infinity;
  let pagedEntityCount = entities.length;

  assert(Array.isArray(entities), 'list can only be performed on endpoints returning an array');
  yield* entities.slice(0, maxEntities);
  if (pagedEntityCount >= maxEntities) return;

  let nextPage: string | undefined = pagination.next ?? undefined;
  while (nextPage !== undefined) {
    const pagedRes = await ctx.client.request<PagedResponse<T>>({
      ...queriedRequest,
      params: {
        ...queriedRequest.params,
        limit: pagedEntityCount,
        cursor: nextPage,
      },
    });
    nextPage = pagedRes.data.pagination.next ?? undefined;
    for (const entity of pagedRes.data.data) {
      yield entity;
      pagedEntityCount += 1;
      if (pagedEntityCount >= maxEntities) return;
    }
  }
}

/** Operation for listing all entities on a v1 endpoint for a given query as an array */
export async function listAllOp<T, Query>(
  ctx: OperationContext,
  query: Query,
  // NOTE: offset is only supported in v1
  opts?: RequestOptions<T[]> & { offset?: number },
) {
  const results: T[] = [];
  for await (const entity of listOp<T, Query>(ctx, query, opts)) {
    results.push(entity);
  }
  return results;
}

/** Operation for listing all entities on a v2 endpoint for a given query as an array */
export async function listAllV2Op<T, Query>(ctx: OperationContext, query: Query, opts?: RequestOptions<T[]>) {
  const results: T[] = [];
  for await (const entity of listV2Op<T, Query>(ctx, query, opts)) {
    results.push(entity);
  }
  return results;
}

/** Operation for listing all entity pages on a v1 endpoint for a given query by
 * automatically handling pagination as and when needed
 */
async function* listByPageOp<T, Query>(
  ctx: OperationContext,
  query: Query,
  // NOTE: offset is only supported in v1
  opts?: RequestOptions<T[]> & { offset?: number },
): AsyncGenerator<AxiosResponse<T[]>> {
  const queriedRequest = {
    ...ctx.request,
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    params: {
      ...ctx.request.params,
      ...query,
      offset: opts?.offset,
    },
  };
  const res = await ctx.client.request<T[]>(queriedRequest);
  const maxEntities = opts?.maxResults ?? Infinity;
  let entityCount = res.data.length;

  assert(Array.isArray(res.data), 'listByPage can only be performed on endpoints returning an array');
  yield res;
  if (entityCount >= maxEntities) return;

  for (const pagedRequest of requestPaginated(res, queriedRequest)) {
    const pagedRes = await ctx.client.request<T[]>(pagedRequest);
    yield pagedRes;
    entityCount += pagedRes.data.length;
    if (entityCount >= maxEntities) return;
  }
}

/** Operation for listing all entity pages on a v2 endpoint for a given query by
 * automatically handling pagination as and when needed
 */
async function* listByPageV2Op<T, Query>(
  ctx: OperationContext,
  query: Query,
  opts?: RequestOptions<T[]>,
): AsyncGenerator<AxiosResponse<PagedResponse<T>>> {
  const queriedRequest = {
    ...ctx.request,
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    params: {
      ...ctx.request.params,
      ...query,
    },
  };
  const res = await ctx.client.request<PagedResponse<T>>(queriedRequest);
  const maxEntities = opts?.maxResults ?? Infinity;
  let entityCount = res.data.data.length;

  assert(Array.isArray(res.data.data), 'listByPage can only be performed on endpoints returning an array');
  yield res;
  if (entityCount >= maxEntities) return;

  let nextPage = res.data.pagination.next;
  while (nextPage !== undefined) {
    const pagedRes = await ctx.client.request<PagedResponse<T>>({
      ...queriedRequest,
      params: {
        ...queriedRequest.params,
        cursor: nextPage,
      },
    });
    nextPage = pagedRes.data.pagination.next;
    yield pagedRes;
    entityCount += pagedRes.data.data.length;
    if (entityCount >= maxEntities) return;
  }
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
  Opts = Parameters<F>[2],
  Return = ReturnType<F> extends RequestConfig<infer _, infer T> ? Promise<T> : ReturnType<F>,
>(ctx: OperationContext, opFunc: F): OpFunction<Return, Param, Opts>;
export function buildOp<
  F extends OpDef<any>,
  Param = Parameters<F>[1],
  Return = ReturnType<F> extends RequestConfig<infer _, infer T> ? Promise<T> : ReturnType<F>,
>(ctx: OperationContext, opFunc: F) {
  return (param: Param, opts?: Parameters<F>[2]) => {
    const configuredContext: OperationContext = {
      ...ctx,
      request: {
        ...ctx.request,
        params: {
          ...ctx.request.params,
          ...paramsFromOptions(opts ?? {}),
        },
      },
    };
    const req = opFunc(configuredContext, param, opts);
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
export function getOpMap<E extends Endpoint<any, any>, T extends E['type'] = E['type']>() {
  return {
    v1: {
      get: getOp<T>,
      delete: deleteOp,
      deleteBatch: deleteBatchOp,
      list: listOp<T, E['queryParameters']>,
      listAll: listAllOp<T, E['queryParameters']>,
      listByPage: listByPageOp<T, E['queryParameters']>,
      create: createOp<T, E['createType']>,
      update: updateOp<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
      updateBatch: updateBatchOp<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
    },
    v2: {
      get: getOp<T>,
      delete: deleteOp,
      deleteBatch: deleteBatchOp,
      list: listV2Op<T, E['queryParameters']>,
      listAll: listAllV2Op<T, E['queryParameters']>,
      listByPage: listByPageV2Op<T, E['queryParameters']>,
      create: createOp<T, E['createType']>,
      update: updateOp<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
      updateBatch: updateBatchOp<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
    },
  } satisfies Record<EndpointVersion, Record<Operation, OpDef<any, any>>>;
}
