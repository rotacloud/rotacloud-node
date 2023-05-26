import { Options, Service } from './service';
import { ToilAllowanceQueryParams } from '../interfaces/query-params/toil-allowance-query-params.interface';
import { ApiToilAllowance } from '../interfaces/toil-allowance.interface';
import { ToilAllowance } from '../models/toil-allowance.model';

export class ToilAllowanceService extends Service {
  private apiPath = '/toil_allowance';

  async *list(query: ToilAllowanceQueryParams, options?: Options) {
    for await (const res of super.iterator<ApiToilAllowance>({ url: this.apiPath, params: query }, options)) {
      yield new ToilAllowance(res);
    }
  }

  listAll(query: ToilAllowanceQueryParams, options?: Options): Promise<ToilAllowance[]>;
  async listAll(query: ToilAllowanceQueryParams, options?: Options) {
    const toilAllowances = [] as ToilAllowance[];
    for await (const allowance of this.list(query, options)) {
      toilAllowances.push(allowance);
    }
    return toilAllowances;
  }

  listByPage(query: ToilAllowanceQueryParams, options?: Options) {
    return super.iterator<ApiToilAllowance>({ url: this.apiPath, params: query }, options).byPage();
  }
}
