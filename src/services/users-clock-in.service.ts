import { AxiosResponse } from 'axios';
import { UserBreak, UserClockedIn, UserClockedOut, TerminalLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

interface UserClockIn {
  method: string;
  shift: number;
  terminal: number;
  user: number;
  photo?: string;
  location: TerminalLocation;
}

interface UserClockOut extends Omit<UserClockIn, 'user' | 'shift'> {}

interface UserBreakRequest {
  method: string;
  action: string;
  terminal: number;
  photo?: string;
  location: TerminalLocation;
}

type RequiredPropsClockIn = 'method';
type RequiredPropsBreak = 'method' | 'action';

export class UsersClockInService extends Service {
  private apiPath = '/users_clocked_in';

  getClockedInUser(id: number): Promise<UserClockedIn>;
  getClockedInUser(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<UserClockedIn, any>>;
  getClockedInUser(id: number, options: Options): Promise<UserClockedIn>;
  getClockedInUser(id: number, options?: Options) {
    return super
      .fetch<UserClockedIn>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<UserClockedIn>({ url: this.apiPath }, options)) {
      yield res;
    }
  }

  listAll(options?: Options): Promise<UserClockedIn[]>;
  async listAll(options?: Options) {
    const users = [] as UserClockedIn[];
    for await (const user of this.list(options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(options?: Options) {
    return super.iterator<UserClockedIn>({ url: this.apiPath }, options).byPage();
  }

  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>): Promise<UserClockedIn>;
  clockIn(
    data: RequirementsOf<UserClockIn, RequiredPropsClockIn>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserClockedIn, any>>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options: Options): Promise<UserClockedIn>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options?: Options) {
    return super
      .fetch<UserClockedIn>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  clockOut(id: number, data: UserClockOut): Promise<UserClockedOut>;
  clockOut(
    id: number,
    data: UserClockOut,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserClockedOut, any>>;
  clockOut(id: number, data: UserClockOut, options: Options): Promise<UserClockedOut>;
  clockOut(id: number, data: UserClockOut, options?: Options) {
    return super
      .fetch<UserClockedOut>({ url: `${this.apiPath}/${id}`, data, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>): Promise<UserBreak>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserBreak, any>>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: Options,
  ): Promise<UserBreak>;
  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<UserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }

  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>): Promise<UserBreak>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserBreak, any>>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: Options,
  ): Promise<UserBreak>;
  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<UserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : res.data));
  }
}
