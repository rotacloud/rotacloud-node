export interface ApiDaysOffPattern {
  id: number;
  user: number;
  start_date: string;
  end_date: string;
  mon_day_off: boolean;
  tue_day_off: boolean;
  wed_day_off: boolean;
  thu_day_off: boolean;
  fri_day_off: boolean;
  sat_day_off: boolean;
  sun_day_off: boolean;
}
