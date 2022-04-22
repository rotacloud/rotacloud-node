import { ApiPayPeriod } from '../interfaces/index.js';

export class PayPeriod {
  public id: number;
  public name: string;

  constructor(payPeriod: ApiPayPeriod) {
    this.id = payPeriod.id;
    this.name = payPeriod.name;
  }
}
