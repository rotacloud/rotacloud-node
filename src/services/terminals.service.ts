import { AxiosResponse } from 'axios';
import { Terminal } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

type RequiredProps = 'name' | 'timezone';

export class TerminalsService extends Service {
  private apiPath = '/terminals';

  create(data: RequirementsOf<Terminal, RequiredProps>): Promise<Terminal>;
  create(
    data: RequirementsOf<Terminal, RequiredProps>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Terminal, any>>;
  create(data: RequirementsOf<Terminal, RequiredProps>, options: Options): Promise<Terminal>;
  create(data: RequirementsOf<Terminal, RequiredProps>, options?: Options) {
    return super
      .fetch<Terminal>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Terminal>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Terminal, any>>;
  get(id: number, options: Options): Promise<Terminal>;
  get(id: number, options?: Options) {
    return super
      .fetch<Terminal>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  update(id: number, data: Partial<Terminal>): Promise<Terminal>;
  update(
    id: number,
    data: Partial<Terminal>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<Terminal, any>>;
  update(id: number, data: Partial<Terminal>, options: Options): Promise<Terminal>;
  update(id: number, data: Partial<Terminal>, options?: Options) {
    return super
      .fetch<Terminal>({
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
    for await (const res of super.iterator<Terminal>({ url: this.apiPath }, options)) {
      yield res;
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
    return super.iterator<Terminal>({ url: this.apiPath }, options).byPage();
  }
}
