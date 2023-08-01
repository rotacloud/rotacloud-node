import { AxiosResponse } from 'axios';
import { ApiTerminal } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Terminal } from '../models/terminal.model.js';

type RequiredProps = 'name' | 'timezone';

class TerminalsService extends Service {
  private apiPath = '/terminals';

  create(data: RequirementsOf<ApiTerminal, RequiredProps>): Promise<Terminal>;
  create(
    data: RequirementsOf<ApiTerminal, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiTerminal, any>>;
  create(data: RequirementsOf<ApiTerminal, RequiredProps>, options: Options): Promise<Terminal>;
  create(data: RequirementsOf<ApiTerminal, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiTerminal>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Terminal(res.data)));
  }

  get(id: number): Promise<Terminal>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiTerminal, any>>;
  get(id: number, options: Options): Promise<Terminal>;
  get(id: number, options?: Options) {
    return super
      .fetch<ApiTerminal>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Terminal(res.data)));
  }

  update(id: number, data: Partial<ApiTerminal>): Promise<Terminal>;
  update(
    id: number,
    data: Partial<ApiTerminal>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiTerminal, any>>;
  update(id: number, data: Partial<ApiTerminal>, options: Options): Promise<Terminal>;
  update(id: number, data: Partial<ApiTerminal>, options?: Options) {
    return super
      .fetch<ApiTerminal>({
        url: `${this.apiPath}/${id}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Terminal(res.data)));
  }

  closeTerminal(id: number): Promise<number>;
  closeTerminal(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  closeTerminal(id: number, options: Options): Promise<number>;
  closeTerminal(id: number, options?: Options) {
    return super
      .fetch({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<ApiTerminal>({ url: this.apiPath }, options)) {
      yield new Terminal(res);
    }
  }

  listAll(options?: Options): Promise<Terminal[]>;
  async listAll(options?: Options) {
    const users = [] as Terminal[];
    for await (const user of this.list(options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(options?: Options) {
    return super.iterator<ApiTerminal>({ url: this.apiPath }, options).byPage();
  }
}
export { TerminalsService };
