export interface DailyRevenue {
  date: string;
  location: number;
  labour_percentage: number | null;
  revenue_target: number | null;
  revenue_actual: number | null;
}
