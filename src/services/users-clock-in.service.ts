import { AxiosResponse } from 'axios';
import { UserBreak, UserClockedIn, UserClockedOut, TerminalLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf, OptionsExtended } from './index.js';

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

export class UsersClockInService extends Service<UserClockedIn> {
  private apiPath = '/users_clocked_in';

  getClockedInUser(id: number): Promise<UserClockedIn>;
  getClockedInUser(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<UserClockedIn>>;
  getClockedInUser(id: number, options: Options): Promise<UserClockedIn>;
  getClockedInUser(id: number, options?: Options) {
    return super
      .fetch<UserClockedIn>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  list(): AsyncGenerator<UserClockedIn>;
  list<F extends keyof UserClockedIn>(
    options: { fields: F[] } & OptionsExtended<UserClockedIn>,
  ): AsyncGenerator<Pick<UserClockedIn, F>>;
  list(options?: OptionsExtended<UserClockedIn>): AsyncGenerator<UserClockedIn>;
  async *list(options?: OptionsExtended<UserClockedIn>) {
    for await (const res of super.iterator<UserClockedIn>({ url: this.apiPath }, options)) {
      yield res;
    }
  }

  listAll(): Promise<UserClockedIn[]>;
  listAll<F extends keyof UserClockedIn>(
    options: { fields: F[] } & OptionsExtended<UserClockedIn>,
  ): Promise<Pick<UserClockedIn, F>[]>;
  listAll(options?: OptionsExtended<UserClockedIn>): Promise<UserClockedIn[]>;
  async listAll(options?: OptionsExtended<UserClockedIn>) {
    const users = [] as UserClockedIn[];
    for await (const user of this.list(options)) {
      users.push(user);
    }
    return users;
  }

  listByPage(): AsyncGenerator<AxiosResponse<UserClockedIn[]>>;
  listByPage<F extends keyof UserClockedIn>(
    options: { fields: F[] } & OptionsExtended<UserClockedIn>,
  ): AsyncGenerator<AxiosResponse<Pick<UserClockedIn, F>[]>>;
  listByPage(options?: OptionsExtended<UserClockedIn>): AsyncGenerator<AxiosResponse<UserClockedIn[]>>;
  listByPage(options?: OptionsExtended<UserClockedIn>) {
    return super.iterator<UserClockedIn>({ url: this.apiPath }, options).byPage();
  }

  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>): Promise<UserClockedIn>;
  clockIn(
    data: RequirementsOf<UserClockIn, RequiredPropsClockIn>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserClockedIn>>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options: Options): Promise<UserClockedIn>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options?: Options) {
    return super
      .fetch<UserClockedIn>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  clockOut(id: number, data: UserClockOut): Promise<UserClockedOut>;
  clockOut(
    id: number,
    data: UserClockOut,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserClockedOut>>;
  clockOut(id: number, data: UserClockOut, options: Options): Promise<UserClockedOut>;
  clockOut(id: number, data: UserClockOut, options?: Options) {
    return super
      .fetch<UserClockedOut>({ url: `${this.apiPath}/${id}`, data, method: 'DELETE' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>): Promise<UserBreak>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserBreak>>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: Options,
  ): Promise<UserBreak>;
  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<UserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }

  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>): Promise<UserBreak>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: { rawResponse: true } & Options,
  ): Promise<AxiosResponse<UserBreak>>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>,
    options: Options,
  ): Promise<UserBreak>;
  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<UserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => (options?.rawResponse ? res : res.data));
  }
}
