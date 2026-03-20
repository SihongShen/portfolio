export interface ParsedCommand {
  command: string;
  args: string[];
}

export function parseCommand(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return { command: "", args: [] };
  }

  return {
    command: parts[0].toLowerCase(),
    args: parts.slice(1)
  };
}
