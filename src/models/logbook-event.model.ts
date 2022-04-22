import { ApiLogbookEvent } from '../interfaces/index.js';

export class LogBookEvent {
  public id: number;

  constructor(logbookEvent: ApiLogbookEvent) {
    this.id = logbookEvent.id;
  }
}
