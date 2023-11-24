export interface RoleRate {
  [key: string]: {
    per_hour: number | null;
    per_shift: number | null;
  };
}
