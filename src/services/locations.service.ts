import { AxiosResponse } from 'axios';
import { Location } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

import { LocationsQueryParams } from '../interfaces/query-params/locations-query-params.interface.js';

type RequiredProps = 'name';

export class LocationsService extends Service<Location> {
  private apiPath = '/locations';

  create(data: RequirementsOf<Location, RequiredProps>): Promise<Location>;
  create(
    data: RequirementsOf<Location, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Location, any>>;
  create(data: RequirementsOf<Location, RequiredProps>, options: Options): Promise<Location>;
  create(data: RequirementsOf<Location, RequiredProps>, options?: Options) {
    return super
      .fetch<Location>({ url: `${this.apiPath}`, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Location>;
  get<F extends keyof Location>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Location>,
  ): Promise<AxiosResponse<Pick<Location, F>>>;
  get<F extends keyof Location>(
    id: number,
    options: { fields: F[] } & OptionsExtended<Location>,
  ): Promise<Pick<Location, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Location>>;
  get(id: number, options?: OptionsExtended<Location>): Promise<Location>;
  get(id: number, options?: OptionsExtended<Location>) {
    return super
      .fetch<Location>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(query?: LocationsQueryParams): AsyncGenerator<Location>;
  list<F extends keyof Location>(
    query: LocationsQueryParams,
    options: { fields: F[] } & OptionsExtended<Location>,
  ): AsyncGenerator<Pick<Location, F>>;
  list(query?: LocationsQueryParams, options?: OptionsExtended<Location>): AsyncGenerator<Location>;
  async *list(query?: LocationsQueryParams, options?: OptionsExtended<Location>) {
    yield* super.iterator({ url: this.apiPath, params: query }, options);
  }

  listAll(query?: LocationsQueryParams): Promise<Location[]>;
  listAll<F extends keyof Location>(
    query: LocationsQueryParams,
    options: { fields: F[] } & OptionsExtended<Location>,
  ): Promise<Pick<Location, F>[]>;
  listAll(query?: LocationsQueryParams, options?: OptionsExtended<Location>): Promise<Location[]>;
  async listAll(query?: LocationsQueryParams, options?: OptionsExtended<Location>) {
    const locations = [] as Location[];
    for await (const location of this.list(query, options)) {
      locations.push(location);
    }
    return locations;
  }

  listByPage(query?: LocationsQueryParams): AsyncGenerator<AxiosResponse<Location[]>>;
  listByPage<F extends keyof Location>(
    query: LocationsQueryParams,
    options: { fields: F[] } & OptionsExtended<Location>,
  ): AsyncGenerator<AxiosResponse<Pick<Location, F>[]>>;
  listByPage(
    query: LocationsQueryParams,
    options?: OptionsExtended<Location>,
  ): AsyncGenerator<AxiosResponse<Location[]>>;
  listByPage(query?: LocationsQueryParams, options?: OptionsExtended<Location>) {
    return super.iterator({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<Location>): Promise<Location>;
  update(
    id: number,
    data: Partial<Location>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Location, any>>;
  update(id: number, data: Partial<Location>, options: Options): Promise<Location>;
  update(id: number, data: Partial<Location>, options?: Options) {
    return super
      .fetch<Location>(
        {
          url: `${this.apiPath}/${id}`,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
