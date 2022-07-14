import { ApiShift } from '../interfaces/index.js';

export class Shift {
  public id: number;
  public deleted: boolean;
  public deleted_at: number | null;
  public deleted_by: number | null;
  public published: boolean;
  public open: boolean;
  public start_time: number;
  public end_time: number;
  public minutes_break: number;
  public user: number;
  public location: number;
  public role: number | null;
  public notes: string | null;
  public created_at: number;
  public created_by: number;
  public updated_at: number | null;
  public updated_by: number | null;
  public claimed: boolean;
  public claimed_at: number | null;
  public acknowledged: boolean;
  public acknowledged_at: number | null;
  public swap_requests: number[];
  public unavailability_requests: number[];

  constructor(shift: ApiShift) {
    this.id = shift.id;
    this.deleted = shift.deleted;
    this.deleted_at = shift.deleted_at;
    this.deleted_by = shift.deleted_by;
    this.published = shift.published;
    this.open = shift.open;
    this.start_time = shift.start_time;
    this.end_time = shift.end_time;
    this.minutes_break = shift.minutes_break;
    this.user = shift.user;
    this.location = shift.location;
    this.role = shift.role;
    this.notes = shift.notes;
    this.created_at = shift.created_at;
    this.created_by = shift.created_by;
    this.updated_at = shift.updated_at;
    this.updated_by = shift.updated_by;
    this.claimed = shift.claimed;
    this.claimed_at = shift.claimed_at;
    this.acknowledged = shift.acknowledged;
    this.acknowledged_at = shift.acknowledged_at;
    this.swap_requests = shift.swap_requests;
    this.unavailability_requests = shift.unavailability_requests;
  }
}
