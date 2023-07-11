import { AxiosResponse } from 'axios';
import { ApiTerminal } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { Terminal } from '../models/terminal.model.js';

type RequiredProps = 'name' | 'timezone';

export class TerminalService extends Service {
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
