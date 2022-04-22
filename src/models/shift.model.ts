import { ApiShift } from '../interfaces/index.js';

export class Shift {
  public id: number;
  public deleted: boolean;
  public published: boolean;
  public open: boolean;
  public start_time: number;
  public end_time: number;
  public minutes_break: number;
  public user: number;
  public location: number;
  public role: number | null;
  public notes: string | null;
  public created_by: number;
  public created_at: number;
  public updated_at: number | null;
  public claimed: boolean;
  public claimed_at: number | null;
  public acknowledged: boolean;
  public acknowledged_at: number | null;
  public swap_requests: number[];
  public unavailability_requests: number[];

  constructor(shift: ApiShift) {
    this.id = shift.id;
    this.deleted = shift.deleted;
    this.open = shift.open;
    this.published = shift.published;
    this.start_time = shift.start_time;
    this.end_time = shift.end_time;
    this.minutes_break = shift.minutes_break;
    this.user = shift.user;
    this.location = shift.location;
    this.role = shift.role;
    this.notes = shift.notes;
    this.created_by = shift.created_by;
    this.created_at = shift.created_at;
    this.updated_at = shift.updated_at;
    this.claimed = shift.claimed;
    this.claimed_at = shift.claimed_at;
    this.acknowledged = shift.acknowledged;
    this.acknowledged_at = shift.acknowledged_at;
    this.swap_requests = shift.swap_requests;
    this.unavailability_requests = shift.unavailability_requests;
  }
}
