export interface DayNote {
  id: number;
  start_date: string;
  end_date: string;
  locations: number[];
  title: string;
  message: string;
  visible_employees: boolean;
}
