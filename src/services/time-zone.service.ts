import { AxiosResponse } from 'axios';
import { Service, Options } from './index.js';

import { TimeZone } from '../interfaces/index.js';

export class TimeZoneService extends Service<TimeZone> {
  private apiPath = '/timezones';

  get(id: number): Promise<TimeZone>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<TimeZone, any>>;
  get(id: number, options: Options): Promise<TimeZone>;
  get(id: number, options?: Options) {
    return super
      .fetch<TimeZone>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  async *list(options?: Options) {
    yield* super.iterator({ url: this.apiPath }, options);
  }

  listAll(options?: Options): Promise<TimeZone[]>;
  async listAll(options?: Options) {
    const timezones = [] as TimeZone[];
    for await (const timezone of this.list(options)) {
      timezones.push(timezone);
    }
    return timezones;
  }

  listByPage(options?: Options) {
    return super.iterator({ url: this.apiPath }, options).byPage();
  }
}
