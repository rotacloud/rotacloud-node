import { AxiosResponse } from 'axios';
import { ApiTerminal, ApiTerminalLocation } from '../interfaces/index.js';
import { Service, Options } from './index.js';

import { Terminal } from '../models/terminal.model.js';

interface LaunchTerminal {
  terminal: number;
  device: string;
  location?: ApiTerminalLocation;
}

interface PingTerminal {
  action: string;
  device: string;
}

class TerminalsActiveService extends Service {
  private apiPath = '/terminals_active';

  launchTerminal(data: LaunchTerminal): Promise<Terminal>;
  launchTerminal(data: LaunchTerminal, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  launchTerminal(data: LaunchTerminal, options: Options): Promise<Terminal>;
  launchTerminal(data: LaunchTerminal, options?: Options) {
    return super
      .fetch<ApiTerminal>({
        url: `${this.apiPath}`,
        data,
        method: 'POST',
      })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new Terminal(res.data)));
  }

  pingTerminal(id: number, data: PingTerminal): Promise<number>;
  pingTerminal(
    id: number,
    data: PingTerminal,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<any, any>>;
  pingTerminal(id: number, data: PingTerminal, options: Options): Promise<number>;
  pingTerminal(id: number, data: PingTerminal, options?: Options) {
    return super
      .fetch({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
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

  closeTerminal(id: number): Promise<number>;
  closeTerminal(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<any, any>>;
  closeTerminal(id: number, options: Options): Promise<number>;
  closeTerminal(id: number, options?: Options) {
    return super
      .fetch({ url: `${this.apiPath}/${id}`, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.status));
  }
}
export { TerminalsActiveService };
