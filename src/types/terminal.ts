export type Phase = "intro" | "terminal";

export type TerminalLineType = "input" | "output" | "system";

export interface TerminalLine {
  id: number;
  type: TerminalLineType;
  content: string;
}

export interface TerminalState {
  lines: TerminalLine[];
  commandHistory: string[];
  historyIndex: number;
}

export type ContactStep = "name" | "email" | "message";

export interface ContactFlowState {
  active: boolean;
  step: ContactStep;
  name: string;
  email: string;
  message: string;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string | "__CLEAR__";
}
