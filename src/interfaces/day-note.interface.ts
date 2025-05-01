export interface DayNote {
  id: number;
  start_date: string;
  end_date: string;
  locations: number[];
  title: string;
  message: string;
  visible_employees: boolean;
}

export interface DayNoteV2 {
  addedAt: string;
  addedBy: number;
  endDate: string;
  id: number;
  locations: number[];
  message: string;
  startDate: string;
  title: string;
  updatedAt: string | null;
  updatedBy: number | null;
  visibleToEmployees: boolean;
}
export interface DayNoteV2QueryParameters {
  location: number;
  start: string;
  end: string;
}
