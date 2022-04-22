import { AxiosResponse } from 'axios';
import { ApiLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Location } from '../models/location.model.js';
import { ErrorResponse } from '../models/error-response.model.js';
import { LocationsQueryParams } from '../interfaces/query-params/locations-query-params.interface.js';
import { InternalQueryParams } from '../interfaces/query-params/internal-query-params.inteface.js';

type RequiredProps = 'name';

class LocationsService extends Service {
  private apiPath = '/locations';

  constructor() {
    super();
  }

  create(data: RequirementsOf<ApiLocation, RequiredProps>): Promise<Location>;
  create(
    data: RequirementsOf<ApiLocation, RequiredProps>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLocation, any>>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options: Options<InternalQueryParams>): Promise<ApiLocation>;
  create(data: RequirementsOf<ApiLocation, RequiredProps>, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLocation>({ url: `${this.apiPath}`, data, method: 'POST' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  get(id: number): Promise<Location>;
  get(
    id: number,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLocation, any>>;
  get(id: number, options: Options<InternalQueryParams>): Promise<ApiLocation>;
  get(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLocation>({ url: `${this.apiPath}/${id}` }, options).then(
      (res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }

  async *list(options?: Options<LocationsQueryParams & InternalQueryParams>) {
    for await (const res of super.iterator<ApiLocation>({ url: this.apiPath }, options)) {
      yield new Location(res);
    }
  }

  listByPage(options?: Options<LocationsQueryParams & InternalQueryParams>) {
    return super.iterator<ApiLocation>({ url: this.apiPath }, options).byPage();
  }

  update(id: number, data: Partial<ApiLocation>): Promise<Location>;
  update(
    id: number,
    data: Partial<ApiLocation>,
    options: { rawResponse: true; params?: InternalQueryParams }
  ): Promise<AxiosResponse<ApiLocation, any>>;
  update(id: number, data: Partial<ApiLocation>, options: Options<InternalQueryParams>): Promise<ApiLocation>;
  update(id: number, data: Partial<ApiLocation>, options?: Options<InternalQueryParams>) {
    return super
      .fetch<ApiLocation>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then(
        (res) => Promise.resolve(options?.rawResponse ? res : new Location(res.data)),
        (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
      );
  }

  delete(id: number): Promise<number>;
  delete(id: number, options: { rawResponse: true; params?: InternalQueryParams }): Promise<AxiosResponse<any, any>>;
  delete(id: number, options: Options<InternalQueryParams>): Promise<number>;
  delete(id: number, options?: Options<InternalQueryParams>) {
    return super.fetch<ApiLocation>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }).then(
      (res) => Promise.resolve(options?.rawResponse ? res : res.status),
      (err) => Promise.reject(options?.rawResponse ? err : new ErrorResponse(err))
    );
  }
}

export { LocationsService };
