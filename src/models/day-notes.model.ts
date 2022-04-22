import { ApiDayNotes } from '../interfaces/index.js';

export class DayNotes {
  public id: number;
  public start_date: string;
  public end_date: string;
  public locations: number[];
  public title: string;
  public message: string;

  constructor(dayNotes: ApiDayNotes) {
    this.id = dayNotes.id;
  }
}
