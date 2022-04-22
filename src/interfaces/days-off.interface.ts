export interface ApiDayOff {
  date: string;
  day_off: boolean;
}

export interface ApiDaysOff {
  user: number;
  dates: ApiDayOff[];
}
