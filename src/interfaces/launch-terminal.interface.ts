import { TerminalLocation } from './terminal.interface.js';

export interface LaunchTerminal {
  terminal: number;
  device: string;
  location?: TerminalLocation;
}
