import { AxiosResponse } from 'axios';
import { ApiLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { LocationsQueryParams } from '../interfaces/query-params/locations-query-params.interface.js';

type RequiredProps = 'name';

export class LocationsService extends Service {
  private apiPath = '/locations';

  create(data: RequirementsOf<ApiLocation, RequiredProps>): Promise<ApiLocation>;
  create(
    data: RequirementsOf<ApiLocation, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiLocation, any>>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options: Options): Promise<ApiLocation>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiLocation>({ url: `${this.apiPath}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiLocation>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiLocation, any>>;
  get(id: number, options: Options): Promise<ApiLocation>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiLocation>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(query?: LocationsQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiLocation>({ url: this.apiPath, params: query }, options)) {
      yield res;
    }
  }

  listAll(query?: LocationsQueryParams, options?: Options): Promise<ApiLocation[]>;
  async listAll(query: LocationsQueryParams, options?: Options) {
    const locations = [] as ApiLocation[];
    for await (const location of this.list(query, options)) {
      locations.push(location);
    }
    return locations;
  }

  listByPage(query?: LocationsQueryParams, options?: Options) {
    return super.iterator<ApiLocation>({ url: this.apiPath, params: query }, options).byPage();
  }

  update(id: number, data: Partial<ApiLocation>): Promise<ApiLocation>;
  update(
    id: number,
    data: Partial<ApiLocation>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiLocation, any>>;
  update(id: number, data: Partial<ApiLocation>, options: Options): Promise<ApiLocation>;
  update(id: number, data: Partial<ApiLocation>, options?: Options) {
    return super
      .fetch<ApiLocation>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
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
