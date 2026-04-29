import type { ReactNode } from 'react';

export interface CommandContext {
  setOpenProject: (slug: string) => void;
  clear: () => void;
}

export interface Command {
  cmd: string;
  match?: RegExp;
  desc: string;
  run: (match: RegExpMatchArray | null, ctx: CommandContext) => ReactNode;
}

export interface Entry {
  input: string;
  cwd: string;
  output: ReactNode;
  key: number;
  first?: boolean;
}

export interface BootLine {
  msg: string;
  tone?: 'dim' | 'fg' | 'green';
  status?: 'ok' | 'warn';
  delay?: number;
}
