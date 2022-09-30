import { ApiDayNote } from '../interfaces/index.js';

export class DayNote {
  public id: number;
  public start_date: string;
  public end_date: string;
  public locations: number[];
  public title: string;
  public message: string;

  constructor(dayNote: ApiDayNote) {
    this.id = dayNote.id;
    this.start_date = dayNote.start_date;
    this.end_date = dayNote.end_date;
    this.locations = dayNote.locations;
    this.title = dayNote.title;
    this.message = dayNote.message;
  }
}
