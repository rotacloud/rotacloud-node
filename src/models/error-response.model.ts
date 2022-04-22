import { AxiosError } from 'axios';

export class ErrorResponse {
  public status: number | undefined;
  public statusText: string | undefined;
  public message: string;
  public data: any;
  constructor(err: AxiosError<any, any>) {
    this.status = err.response?.status;
    this.statusText = err.response?.statusText;
    this.message = err.message;
    this.data = err.response?.data;
  }
}
