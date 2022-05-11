import {
  AccountsService,
  AttendanceService,
  DaysOffService,
  GroupsService,
  LeaveEmbargoesService,
  LeaveRequestService,
  LeaveService,
  LocationsService,
  RolesService,
  ShiftsService,
  UsersService,
} from './services/index.js';
import { SDKConfig } from './interfaces/index.js';

export class RotaCloud {
  public static config: SDKConfig;

  public defaultAPIURI = 'https://api.rotacloud.com/v1';
  public accounts = new AccountsService();
  public attendance = new AttendanceService();
  public daysOff = new DaysOffService();
  public groups = new GroupsService();
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
    return RotaCloud.config;
  }

  set config(configVal: SDKConfig) {
    RotaCloud.config = configVal;
  }
}
