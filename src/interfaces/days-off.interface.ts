export interface DayOff {
  date: string;
  day_off: boolean;
}

export interface DaysOff {
  user: number;
  dates: DayOff[];
}
