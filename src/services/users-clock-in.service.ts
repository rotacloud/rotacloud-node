import { AxiosResponse } from 'axios';
import { ApiUserClockedIn, ApiUserClockedOut } from '../interfaces/index.js';
import { Service, Options, RequirementsOf } from './index.js';

import { UserClockedIn, UserClockedOut } from '../models/index.js';

interface UserClockInRequest {
  method: string;
  terminal: number;
  user: number;
  shift: number;
}

interface UserClockOutRequest extends Omit<UserClockInRequest, 'user' | 'shift'> {}

interface UserBreakRequest {
  method: string;
  action: string;
  terminal: number;
}

interface StartLocation {
  start_location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
}

interface EndLocation {
  end_location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
}

interface ApiUserBreak {
  start_time: number;
  start_location: StartLocation;
  end_time?: number;
  end_location?: EndLocation;
}

class UserBreak {
  public start_time: number;
  public start_location: StartLocation;
  public end_time: number | null;
  public end_location: EndLocation | null;
  constructor(apiUserBreak: ApiUserBreak) {
    this.start_time = apiUserBreak.start_time;
    this.start_location = apiUserBreak.start_location;
    this.end_time = apiUserBreak.end_time ?? null;
    this.end_location = apiUserBreak.end_location ?? null;
  }
}

type RequiredProps = 'method';

class UsersClockInService extends Service {
  private apiPath = '/users_clocked_in';

  clockIn(data: RequirementsOf<UserClockInRequest, RequiredProps>): Promise<UserClockedIn>;
  clockIn(
    data: RequirementsOf<UserClockInRequest, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserClockedIn, any>>;
  clockIn(data: RequirementsOf<UserClockInRequest, RequiredProps>, options: Options): Promise<UserClockedIn>;
  clockIn(data: RequirementsOf<UserClockInRequest, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiUserClockedIn>({ url: this.apiPath, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserClockedIn(res.data)));
  }

  clockOut(id: number, data: UserClockOutRequest): Promise<UserClockedOut>;
  clockOut(
    id: number,
    data: UserClockOutRequest,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserClockedOut, any>>;
  clockOut(id: number, data: UserClockOutRequest, options: Options): Promise<UserClockedOut>;
  clockOut(id: number, data: UserClockOutRequest, options?: Options) {
    return super
      .fetch<ApiUserClockedOut>({ url: `${this.apiPath}/${id}`, data, method: 'DELETE' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserClockedOut(res.data)));
  }

  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>): Promise<UserBreak>;
  startBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserBreak, any>>;
  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>, options: Options): Promise<UserBreak>;
  startBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiUserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserBreak(res.data)));
  }

  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>): Promise<UserBreak>;
  endBreak(
    id: number,
    data: RequirementsOf<UserBreakRequest, RequiredProps>,
    options: { rawResponse: true } & Options
  ): Promise<AxiosResponse<ApiUserBreak, any>>;
  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>, options: Options): Promise<UserBreak>;
  endBreak(id: number, data: RequirementsOf<UserBreakRequest, RequiredProps>, options?: Options) {
    return super
      .fetch<ApiUserBreak>({ url: `${this.apiPath}/${id}`, data, method: 'POST' })
      .then((res) => Promise.resolve(options?.rawResponse ? res : new UserBreak(res.data)));
  }
}

export { UsersClockInService };
