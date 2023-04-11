import { AxiosResponse } from 'axios';
import { ApiLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Location } from '../models/location.model.js';

import { LocationsQueryParams } from '../interfaces/query-params/locations-query-params.interface.js';

type RequiredProps = 'name';

export class LocationsService extends Service {
  private apiPath = '/locations';

  create(data: RequirementsOf<ApiLocation, RequiredProps>): Promise<Location>;
  create(
    data: RequirementsOf<ApiLocation, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLocation, any>>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options: Options): Promise<Location>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLocation>({ url: `${this.apiPath}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)));
  }

  get(id: number): Promise<Location>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiLocation, any>>;
  get(id: number, options: Options): Promise<Location>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLocation>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)));
  }

  async *list(query?: LocationsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLocation>({ url: this.apiPath, params: query }, options)) {
      yield new Location(res);
    }
  }

  listAll(query?: LocationsQueryParams, options?: Options): Promise<Location[]>;
  async listAll(query: LocationsQueryParams, options?: Options) {
    const locations = [] as Location[];
    for await (const location of this.list(query, options)) {
      locations.push(location);
    }
    return locations;
  }

  listByPage(query?: LocationsQueryParams, options?: Options) {
    return super.iterator<ApiLocation>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLocation>): Promise<Location>;
  update(
    id: number,
    data: Partial<ApiLocation>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiLocation, any>>;
  update(id: number, data: Partial<ApiLocation>, options: Options): Promise<Location>;
  update(id: number, data: Partial<ApiLocation>, options?: Options) {
    return super
      .fetch<ApiLocation>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)));
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options): Promise<number>;
  delete(id: number, options?: Options) {
    return super
      .fetch<ApiLocation>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
