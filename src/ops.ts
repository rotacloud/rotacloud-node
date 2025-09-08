import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceSpecification } from './service.js';
import { RequestOptions, QueryParameterValue, RequirementsOf, assert } from './utils.js';
import { Endpoint, EndpointVersion } from './endpoint.js';
import { SDKConfig } from './interfaces/index.js';
import { ValidationError } from './error.js';

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
 */
export type OpDef<T, Param = any, Opts extends Partial<RequestOptions<any>> = RequestOptions<unknown>, Return = T> =
  | ((ctx: OperationContext, param: Param, opts?: Opts) => RequestConfig<T, Return>)
  | ((ctx: OperationContext, param: Param, opts?: Opts) => AsyncIterable<T>)
  | ((ctx: OperationContext, param: Param, opts?: Opts) => Promise<T>);

/** Operation function type to be called by the end user of the SDK.
 *
 * All methods on services follow this typing.
 */
export type OpFunction<Return = any, Param = undefined, Opts = RequestOptions<unknown>> = Return extends
  | AsyncIterable<infer U>
  | Promise<Iterable<infer U>>
  ? // List based op parameter names
  Param extends undefined
  ? {
    (query?: Param): Return;
    <F extends keyof U>(
      query: Param,
      options: { fields: F[] } & RequestOptions<U>,
    ): Return extends AsyncIterable<U>
      ? Promise<AsyncIterable<Pick<U, F>>>
      : Return extends Promise<Array<U>>
      ? Promise<Array<Pick<U, F>>>
      : Promise<Iterable<Pick<U, F>>>;
    (query: Param, options?: Opts): Return;
  }
  : Partial<Param> extends Param
  ? {
    (query?: Param): Return;
    <F extends keyof U>(
      query: Param,
      options: { fields: F[] } & RequestOptions<U>,
    ): Return extends AsyncIterable<U>
      ? Promise<AsyncIterable<Pick<U, F>>>
      : Return extends Promise<Array<U>>
      ? Promise<Array<Pick<U, F>>>
      : Promise<Iterable<Pick<U, F>>>;
    (query?: Param, options?: Opts): Return;
  }
  : {
    (query: Param): Return;
    <F extends keyof U>(
      query: Param,
      options: { fields: F[] } & RequestOptions<U>,
    ): Return extends AsyncIterable<U>
      ? Promise<AsyncIterable<Pick<U, F>>>
      : Return extends Promise<Array<U>>
      ? Promise<Array<Pick<U, F>>>
      : Promise<Iterable<Pick<U, F>>>;
    (query: Param, Options?: Opts): Return;
  }
  : // ID based op parameters
  Param extends number
  ? {
    (id: Param): Return;
    <F extends keyof Awaited<Return>>(
      id: Param,
      options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Pick<Awaited<Return>, F>>>;
    <F extends keyof Awaited<Return>>(
      id: Param,
      options: { fields: F[] } & RequestOptions<Awaited<Return>>,
    ): Promise<Pick<Awaited<Return>, F>>;
    (
      id: Param,
      options?: {
        rawResponse: true;
      } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Awaited<Return>>>;
    (id: Param, options?: RequestOptions<Awaited<Return>>): Return;
  }
  : Param extends number[]
  ? {
    (ids: Param): Return;
    <F extends keyof Awaited<Return>>(
      ids: Param,
      options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Pick<Awaited<Return>, F>>>;
    <F extends keyof Awaited<Return>>(
      ids: Param,
      options: { fields: F[] } & RequestOptions<Awaited<Return>>,
    ): Promise<Pick<Awaited<Return>, F>>;
    (
      ids: Param,
      options?: {
        rawResponse: true;
      } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Awaited<Return>>>;
    (ids: Param, options?: RequestOptions<Awaited<Return>>): Return;
  }
  : // Undefined based op parameters - ensures ops that don't require a
  // param aren't forced to specify `undefined` but can if they need to specify
  // options
  Param extends undefined
  ? {
    (): Return;
    <F extends keyof Awaited<Return>>(
      none: Param,
      options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Pick<Awaited<Return>, F>>>;
    <F extends keyof Awaited<Return>>(
      none: Param,
      options: { fields: F[] } & RequestOptions<Awaited<Return>>,
    ): Promise<Pick<Awaited<Return>, F>>;
    (
      none?: Param,
      options?: {
        rawResponse: true;
      } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Awaited<Return>>>;
    (none?: Param, options?: RequestOptions<Awaited<Return>>): Return;
  }
  : // Entity based op parameter names
  {
    (entity: Param): Return;
    <F extends keyof Awaited<Return>>(
      entity: Param,
      options: { fields: F[]; rawResponse: true } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Pick<Awaited<Return>, F>>>;
    <F extends keyof Awaited<Return>>(
      entity: Param,
      options: { fields: F[] } & RequestOptions<Awaited<Return>>,
    ): Promise<Pick<Awaited<Return>, F>>;
    (
      entity: Param,
      options?: {
        rawResponse: true;
      } & RequestOptions<Awaited<Return>>,
    ): Promise<AxiosResponse<Awaited<Return>>>;
    (entity: Param, options?: RequestOptions<Awaited<Return>>): Return;
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

/** For validating the query parameter supplied to list ops
 *
 * @throws {ValidationError} if invalid
 */
function validateQueryParameter(query: unknown) {
  // undefined is an accepted type for query
  if (query !== undefined && (typeof query !== 'object' || query === null)) {
    throw new ValidationError('Invalid type for query', {
      cause: {
        type: typeof query,
        value: query,
      },
    });
  }
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
  if (typeof id !== 'number') {
    throw new ValidationError('Invalid type for id', {
      cause: {
        type: typeof id,
      },
    });
  }
  if (!Number.isSafeInteger(id)) {
    throw new ValidationError('Invalid value for id', {
      cause: {
        reason: 'Not a safe integer',
        value: id,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'GET',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${id}`,
  };
}

/** Operation for creating an entity */
export function createOp<T = unknown, NewEntity = unknown>(
  ctx: OperationContext,
  newEntity: NewEntity,
): RequestConfig<NewEntity, T> {
  if (typeof newEntity !== 'object' || newEntity === null) {
    throw new ValidationError('Invalid type for entity', {
      cause: {
        type: typeof newEntity,
        value: newEntity,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    data: newEntity,
  };
}

/** Operation for updating an entity for v1 endpoints */
function updateV1Op<Return, Entity extends { id: number } & Partial<Return>>(
  ctx: OperationContext,
  entity: Entity,
): RequestConfig<Entity, Return> {
  if (typeof entity !== 'object' || entity === null || !('id' in entity)) {
    throw new ValidationError('Invalid type for entity', {
      cause: {
        type: typeof entity,
        value: entity,
      },
    });
  }
  if (!Number.isSafeInteger(entity.id)) {
    throw new ValidationError('Invalid value for entity id', {
      cause: {
        reason: 'Not a safe integer',
        value: entity.id,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'POST',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${entity.id}`,
    data: entity,
  };
}

/** Operation for updating an entity for v2 endpoints */
function updateV2Op<Return, Entity extends { id: number } & Partial<Return>>(
  ctx: OperationContext,
  entity: Entity,
): RequestConfig<Entity, Return> {
  if (typeof entity !== 'object' || entity === null || !('id' in entity)) {
    throw new ValidationError('Invalid type for entity', {
      cause: {
        type: typeof entity,
        value: entity,
      },
    });
  }
  if (!Number.isSafeInteger(entity.id)) {
    throw new ValidationError('Invalid value for entity id', {
      cause: {
        reason: 'Not a safe integer',
        value: entity.id,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'PUT',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${entity.id}`,
    data: entity,
  };
}

/** Operation for deleting a list of entities */
async function updateBatchOp<Return, Entity extends { id: number } & Partial<Return>>(
  ctx: OperationContext,
  entities: Entity[],
): Promise<{ success: Return[]; failed: { id: number; error: string }[] }> {
  if (!Array.isArray(entities)) {
    throw new ValidationError('Invalid type for entity array', {
      cause: {
        type: typeof entities,
      },
    });
  }

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
  if (typeof id !== 'number') {
    throw new ValidationError('Invalid type for id', {
      cause: {
        type: typeof id,
      },
    });
  }
  if (!Number.isSafeInteger(id)) {
    throw new ValidationError('Invalid value for id', {
      cause: {
        reason: 'Not a safe integer',
        value: id,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}/${id}`,
  };
}

/** Operation for deleting a list of entities */
function deleteBatchOp(ctx: OperationContext, ids: number[]): RequestConfig<unknown, void> {
  if (!Array.isArray(ids)) {
    throw new ValidationError('Invalid type for id array', {
      cause: {
        type: typeof ids,
      },
    });
  }

  return {
    ...ctx.request,
    method: 'DELETE',
    url: `${ctx.service.endpointVersion}/${ctx.service.endpoint}`,
    data: { ids },
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
  validateQueryParameter(query);
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
  validateQueryParameter(query);

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
  validateQueryParameter(query);

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
  validateQueryParameter(query);

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

  let nextPage = res.data.pagination.next ?? undefined;
  while (nextPage !== undefined) {
    const pagedRes = await ctx.client.request<PagedResponse<T>>({
      ...queriedRequest,
      params: {
        ...queriedRequest.params,
        cursor: nextPage,
      },
    });
    nextPage = pagedRes.data.pagination.next ?? undefined;
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
      update: updateV1Op<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
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
      update: updateV2Op<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
      updateBatch: updateBatchOp<T, T extends { id: number } ? RequirementsOf<T, 'id'> : never>,
    },
  } satisfies Record<EndpointVersion, Record<Operation, OpDef<any, any>>>;
}
