import { TerminalLocation } from './terminal.interface.js';

export interface UserClockIn {
  method: string;
  shift: number;
  terminal?: number;
  user: number;
  photo?: string;
  location?: TerminalLocation;
}

export interface UserClockOut extends Omit<UserClockIn, 'user' | 'shift'> {}

export interface UserBreakRequest {
  method: string;
  action: string;
  terminal: number;
  photo?: string;
  location: TerminalLocation;
}
