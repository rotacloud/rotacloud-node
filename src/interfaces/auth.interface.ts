export interface AuthAccount {
  id: number;
  name: string;
}

export interface Auth {
  two_factor_enabled: boolean;
  accounts: AuthAccount[];
}
