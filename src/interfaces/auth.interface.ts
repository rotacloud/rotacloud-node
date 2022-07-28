export interface ApiAuthAccount {
  id: number;
  name: string;
}

export interface ApiAuth {
  two_factor_enabled: boolean;
  accounts: ApiAuthAccount[];
}
