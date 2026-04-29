import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Entry, BootLine, Command, CommandContext } from '../types';

interface BootSequenceResult {
  transcript: Entry[];
  typing: { input: string; cwd: string; key: number } | null;
  bootLines: BootLine[];
  done: boolean;
  setTranscript: React.Dispatch<React.SetStateAction<Entry[]>>;
  clearAll: () => void;
}

type ResolveCommand = (input: string) => { cmd: Command; match: RegExpMatchArray | null } | null;

export function useBootSequence(
  script: string[],
  cwd: string,
  enabled: boolean,
  bootLog: BootLine[],
  resolveCommand: ResolveCommand,
  NotFound: (props: { cmd: string }) => ReactNode,
): BootSequenceResult {
  const [transcript, setTranscript] = useState<Entry[]>([]);
  const [typing, setTyping] = useState<{ input: string; cwd: string; key: number } | null>(null);
  const [bootLines, setBootLines] = useState<BootLine[]>([]);
  const [done, setDone] = useState(false);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fast =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('fast');

  const clearAll = useCallback(() => {
    setTranscript([]);
    setBootLines([]);
    setTyping(null);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let entries: Entry[] = [];
    let logged: BootLine[] = [];
    let typedKey = 0;
    const sleep = (ms: number) =>
      new Promise<void>((r) => setTimeout(r, prefersReduced || fast ? 0 : ms));

    (async () => {
      // initial pause — blank cursor blinks
      await sleep(500);

      // boot log lines
      for (let i = 0; i < bootLog.length; i++) {
        if (cancelled) return;
        logged = [...logged, bootLog[i]];
        setBootLines([...logged]);
        await sleep(bootLog[i].delay ?? 220 + Math.random() * 150);
      }
      if (bootLog.length) await sleep(600);

      // auto-typed commands
      for (let i = 0; i < script.length; i++) {
        const cmd = script[i];
        const partial = { input: '', cwd, key: ++typedKey };

        for (let j = 0; j <= cmd.length; j++) {
          if (cancelled) return;
          setTyping({ ...partial, input: cmd.slice(0, j) });
          await sleep(40 + Math.random() * 50);
        }

        // "press enter" pause
        await sleep(280);

        const resolved = resolveCommand(cmd);
        const ctx: CommandContext = { setOpenProject: () => {}, clear: () => {}, cwd: '~', setCwd: () => {}, destroy: () => {} };
        const output = resolved
          ? resolved.cmd.run(resolved.match, ctx)
          : NotFound({ cmd });

        entries = [
          ...entries,
          { input: cmd, cwd, output, key: ++typedKey, first: i === 0 },
        ];
        setTranscript([...entries]);
        setTyping(null);

        // pause between commands
        await sleep(600);
      }

      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { transcript, typing, bootLines, done, setTranscript, clearAll };
}
