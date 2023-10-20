import { AxiosResponse } from 'axios';
import { Terminal } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

type RequiredProps = 'name' | 'timezone';

export class TerminalsService extends Service<Terminal> {
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
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  get(id: number): Promise<Terminal>;
  get<F extends keyof Terminal>(
    id: number,
    options: { fields: F[]; rawResponse: true } & OptionsExtended<Terminal>,
  ): Promise<AxiosResponse<Pick<Terminal, F>>>;
  get<F extends keyof Terminal>(
    id: number,
    options: { fields: F[] } & OptionsExtended<Terminal>,
  ): Promise<Pick<Terminal, F>>;
  get(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<Terminal>>;
  get(id: number, options?: OptionsExtended<Terminal>): Promise<Terminal>;
  get(id: number, options?: Options) {
    return super
      .fetch<Terminal>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
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
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  closeTerminal(id: number): Promise<number>;
  closeTerminal(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  closeTerminal(id: number, options: Options): Promise<number>;
  closeTerminal(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => (options?.rawResponse ? res : res.status));
  }

  list(): AsyncGenerator<Terminal>;
  list<F extends keyof Terminal>(
    options: { fields: F[] } & OptionsExtended<Terminal>,
  ): AsyncGenerator<Pick<Terminal, F>>;
  list(options?: OptionsExtended<Terminal>): AsyncGenerator<Terminal>;
  async *list(options?: Options) {
    yield* super.iterator({ url: this.apiPath }, options);
  }

  listAll(): Promise<Terminal[]>;
  listAll<F extends keyof Terminal>(
    options: { fields: F[] } & OptionsExtended<Terminal[]>,
  ): Promise<Pick<Terminal, F>[]>;
  listAll(options?: OptionsExtended<Terminal>): Promise<Terminal[]>;
  async listAll(options?: Options) {
    const users = [] as Terminal[];
    for await (const user of this.list(options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(): AsyncGenerator<AxiosResponse<Terminal[]>>;
  listByPage<F extends keyof Terminal>(
    options: { fields: F[] } & OptionsExtended<Terminal[]>,
  ): AsyncGenerator<AxiosResponse<Pick<Terminal, F>[]>>;
  listByPage(options?: OptionsExtended<Terminal>): AsyncGenerator<AxiosResponse<Terminal[]>>;
  listByPage(options?: Options) {
    return super.iterator({ url: this.apiPath }, options).byPage();
  }
}
