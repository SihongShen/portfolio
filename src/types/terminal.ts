export type Phase = "intro" | "terminal";

export type TerminalLineType = "input" | "output" | "system" | "error";

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

export type ContactStep = "platform_selection";

export interface ContactFlowState {
  active: boolean;
  step: ContactStep;
}

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => string | "__CLEAR__";
}
