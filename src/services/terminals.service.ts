import { AxiosResponse } from 'axios';
import { ApiTerminal } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

type RequiredProps = 'name' | 'timezone';

export class TerminalsService extends Service {
  private apiPath = '/terminals';

  create(data: RequirementsOf<ApiTerminal, RequiredProps>): Promise<ApiTerminal>;
  create(
    data: RequirementsOf<ApiTerminal, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiTerminal, any>>;
  create(data: RequirementsOf<ApiTerminal, RequiredProps>, options: Options): Promise<ApiTerminal>;
  create(data: RequirementsOf<ApiTerminal, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiTerminal>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<ApiTerminal>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiTerminal, any>>;
  get(id: number, options: Options): Promise<ApiTerminal>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiTerminal>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  update(id: number, data: Partial<ApiTerminal>): Promise<ApiTerminal>;
  update(
    id: number,
    data: Partial<ApiTerminal>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<ApiTerminal, any>>;
  update(id: number, data: Partial<ApiTerminal>, options: Options): Promise<ApiTerminal>;
  update(id: number, data: Partial<ApiTerminal>, options?: Options) {
    return super
      .fetch<ApiTerminal>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  closeTerminal(id: number): Promise<number>;
  closeTerminal(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<number, any>>;
  closeTerminal(id: number, options: Options): Promise<number>;
  closeTerminal(id: number, options?: Options) {
    return super
      .fetch({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<ApiTerminal>({ url: this.apiPath }, options)) {
      yield res;
    }
  }

  listAll(options?: Options): Promise<ApiTerminal[]>;
  async listAll(options?: Options) {
    const users = [] as ApiTerminal[];
    for await (const user of this.list(options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(options?: Options) {
    return super.iterator<ApiTerminal>({ url: this.apiPath }, options).byPage();
  }
}
