export interface Role {
  id: number;
  deleted: boolean;
  name: string | null;
  colour: string;
  default_break: number;
  users: number[];
  pay_code: string;
}
