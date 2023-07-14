import { AxiosResponse } from 'axios';
import { ApiUserBreak, ApiUserClockedIn, ApiUserClockedOut, ApiTerminalLocation } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { UserClockedIn, UserClockedOut } from '../models/index.js';

interface UserClockIn {
  method: string;
  shift: number;
  terminal: number;
  user: number;
  photo?: string;
  location?: ApiTerminalLocation;
}

interface UserClockOut extends Omit<UserClockIn, 'user' | 'shift'> {}

interface UserBreak {
  method: string;
  action: string;
  terminal: number;
  photo?: string;
  location?: ApiTerminalLocation;
}

class UserBreak {
  public start_time: number;
  public start_location: ApiTerminalLocation;
  public end_time: number | null;
  public end_location: ApiTerminalLocation | null;
  constructor(apiUserBreak: ApiUserBreak) {
    this.start_time = apiUserBreak.start_time;
    this.start_location = apiUserBreak.start_location;
    this.end_time = apiUserBreak.end_time ?? null;
    this.end_location = apiUserBreak.end_location ?? null;
  }
}

type RequiredPropsClockIn = 'method';
type RequiredPropsBreak = 'method' | 'action';

class UsersClockInService extends Service {
  private apiPath = '/users_clocked_in';

  getClockedInUser(id: number): Promise<UserClockedIn>;
  getClockedInUser(id: number, options: { rawResponse: true } & Options): Promise<AxiosResponse<ApiUserClockedIn, any>>;
  getClockedInUser(id: number, options: Options): Promise<UserClockedIn>;
  getClockedInUser(id: number, options?: Options) {
    return super
      .fetch<ApiUserClockedIn>({ url: `${this.apiPath}/${id}` }, options)
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserClockedIn(res.data)));
  }

  async *list(options?: Options) {
    for await (const res of super.iterator<ApiUserClockedIn>({ url: this.apiPath }, options)) {
      yield new UserClockedIn(res);
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
    return super.iterator<ApiUserClockedIn>({ url: this.apiPath }, options).byPage();
  }

  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>): Promise<UserClockedIn>;
  clockIn(
    data: RequirementsOf<UserClockIn, RequiredPropsClockIn>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserClockedIn, any>>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options: Options): Promise<UserClockedIn>;
  clockIn(data: RequirementsOf<UserClockIn, RequiredPropsClockIn>, options?: Options) {
    return super
      .fetch<ApiUserClockedIn>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserClockedIn(res.data)));
  }

  clockOut(id: number, data: UserClockOut): Promise<UserClockedOut>;
  clockOut(
    id: number,
    data: UserClockOut,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserClockedOut, any>>;
  clockOut(id: number, data: UserClockOut, options: Options): Promise<UserClockedOut>;
  clockOut(id: number, data: UserClockOut, options?: Options) {
    return super
      .fetch<ApiUserClockedOut>({ url: `${this.apiPath}/${id}`, data, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserClockedOut(res.data)));
  }

  startBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>): Promise<UserBreak>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreak, RequiredPropsBreak>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserBreak, any>>;
  startBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>, options: Options): Promise<UserBreak>;
  startBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<ApiUserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserBreak(res.data)));
  }

  endBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>): Promise<UserBreak>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreak, RequiredPropsBreak>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserBreak, any>>;
  endBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>, options: Options): Promise<UserBreak>;
  endBreak(id: number, data: RequirementsOf<UserBreak, RequiredPropsBreak>, options?: Options) {
    return super
      .fetch<ApiUserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserBreak(res.data)));
  }
}

export { UsersClockInService };
