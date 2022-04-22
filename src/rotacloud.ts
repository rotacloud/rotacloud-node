import {
  AccountsService,
  AttendanceService,
  LeaveEmbargoesService,
  LeaveRequestService,
  LeaveService,
  LocationsService,
  RolesService,
  ShiftsService,
  UsersService,
} from './services/index.js';
import { SDKConfig } from './interfaces/index.js';
import { DaysOffService } from './services/days-off.service.js';

export class Rotacloud {
  public static config: SDKConfig;

  public defaultAPIURI = 'https://api.rotacloud.com/v1';
  public accounts = new AccountsService();
  public attendance = new AttendanceService();
  public daysOff = new DaysOffService();
  public leaveEmbargoes = new LeaveEmbargoesService();
  public leaveRequests = new LeaveRequestService();
  public leave = new LeaveService();
  public locations = new LocationsService();
  public roles = new RolesService();
  public shifts = new ShiftsService();
  public users = new UsersService();

  constructor(config: SDKConfig) {
    if (!config.baseUri) {
      config.baseUri = this.defaultAPIURI;
    }
    this.config = config;
  }

  get config() {
    return Rotacloud.config;
  }

  set config(configVal: SDKConfig) {
    Rotacloud.config = configVal;
  }
}
