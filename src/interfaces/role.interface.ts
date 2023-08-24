export interface Role {
  id: number;
  deleted: boolean;
  name: string;
  colour: string;
  default_break: number;
  users: number[];
  pay_code: string;
}
