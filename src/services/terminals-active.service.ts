import { AxiosResponse } from 'axios';
import { Terminal, TerminalLocation } from '../interfaces/index.js';
import { Service, Options, OptionsExtended } from './index.js';

interface LaunchTerminal {
  terminal: number;
  device: string;
  location?: TerminalLocation;
}

interface PingTerminal {
  action: string;
  device: string;
}

export class TerminalsActiveService extends Service<Terminal> {
  private apiPath = '/terminals_active';

  launchTerminal(data: LaunchTerminal): Promise<Terminal>;
  launchTerminal(data: LaunchTerminal, options: { rawResponse: true } & Options): Promise<AxiosResponse<Terminal>>;
  launchTerminal(data: LaunchTerminal, options: Options): Promise<Terminal>;
  launchTerminal(data: LaunchTerminal, options?: Options) {
    return super
      .fetch<Terminal>(
        {
          url: this.apiPath,
          data,
          method: 'POST',
        },
        options,
      )
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  pingTerminal(id: number, data: PingTerminal): Promise<number>;
  pingTerminal(
    id: number,
    data: PingTerminal,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<number>>;
  pingTerminal(id: number, data: PingTerminal, options: Options): Promise<number>;
  pingTerminal(id: number, data: PingTerminal, options?: Options) {
    return super
      .fetch<number>({ url: `${this.apiPath}/${id}`, data, method: 'POST' }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(): AsyncGenerator<Terminal>;
  list<F extends keyof Terminal>(
    options: { fields: F[] } & OptionsExtended<Terminal>,
  ): AsyncGenerator<Pick<Terminal, F>>;
  list(options?: OptionsExtended<Terminal>): AsyncGenerator<Terminal>;
  async *list(options?: OptionsExtended<Terminal>) {
    yield* super.iterator({ url: this.apiPath }, options);
  }

  listAll(): Promise<Terminal[]>;
  listAll<F extends keyof Terminal>(options: { fields: F[] } & OptionsExtended<Terminal>): Promise<Pick<Terminal, F>[]>;
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
    options: { fields: F[] } & OptionsExtended<Terminal>,
  ): AsyncGenerator<AxiosResponse<Pick<Terminal, F>[]>>;
  listByPage(options?: OptionsExtended<Terminal>): AsyncGenerator<AxiosResponse<Terminal[]>>;
  listByPage(options?: Options) {
    return super.iterator({ url: this.apiPath }, options).byPage();
  }

  closeTerminal(id: number): Promise<number>;
  closeTerminal(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<void>>;
  closeTerminal(id: number, options: Options): Promise<number>;
  closeTerminal(id: number, options?: Options) {
    return super
      .fetch<void>({ url: `${this.apiPath}/${id}`, method: 'DELETE' }, options)
      .then((res) => (options?.rawResponse ? res : res.status));
  }
}
