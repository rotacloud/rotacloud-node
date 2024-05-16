import { Options, Service } from './service.js';
import { ToilAllowanceQueryParams } from '../interfaces/query-params/toil-allowance-query-params.interface.js';
import { ToilAllowance } from '../interfaces/toil-allowance.interface.js';

export class ToilAllowanceService extends Service<ToilAllowance> {
  private apiPath = '/toil_allowance';

  async *list(year: number, query: ToilAllowanceQueryParams, options?: Options) {
    yield* super.iterator({ url: `${this.apiPath}/${year}`, params: query }, options);
  }

  async listAll(year: number, query: ToilAllowanceQueryParams, options?: Options): Promise<ToilAllowance[]> {
    const toilAllowances = [] as ToilAllowance[];
    for await (const allowance of this.list(year, query, options)) {
      toilAllowances.push(allowance);
    }
    return toilAllowances;
  }

  listByPage(year: number, query: ToilAllowanceQueryParams, options?: Options) {
    return super.iterator({ url: `${this.apiPath}/${year}`, params: query }, options).byPage();
  }
}
