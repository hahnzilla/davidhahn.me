import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { COMMANDS, resolveCommand, NotFound } from './commands';
import { useBootSequence } from './hooks/useBootSequence';
import { useViewport } from './hooks/useViewport';
import { PROFILE } from './data/profile';
import type { Entry, BootLine } from './types';
import s from './Terminal.module.css';

// ── Prompt ──
function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className={s.promptWrap}>
      <span className={s.promptUser}>{PROFILE.user}</span>
      <span className={s.promptAt}>@</span>
      <span className={s.promptHost}>{PROFILE.host}</span>
      <span className={s.promptColon}>:</span>
      <span className={s.promptCwd}>{cwd}</span>
      <span className={s.promptDollar}>$&nbsp;</span>
    </span>
  );
}

// ── Cursor ──
function Cursor() {
  return <span className={s.cursor} />;
}

// ── Transcript block ──
function Block({ entry }: { entry: Entry }) {
  return (
    <div className={`${s.block}${entry.first ? ` ${s.blockFirst}` : ''}`}>
      <div className={s.blockCmd}>
        <Prompt cwd={entry.cwd} />
        <span>{entry.input}</span>
      </div>
      {entry.output != null && (
        <div className={s.blockOutput}>{entry.output}</div>
      )}
    </div>
  );
}

// ── Interactive input ──
function InputLine({
  cwd,
  history,
  onRun,
  mobile,
}: {
  cwd: string;
  history: string[];
  onRun: (val: string) => void;
  mobile: boolean;
}) {
  const [val, setVal] = useState('');
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onRun(val);
      setVal('');
      setHi(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(history.length - 1, hi + 1);
      if (next >= 0) {
        setHi(next);
        setVal(history[history.length - 1 - next] ?? '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(-1, hi - 1);
      setHi(next);
      setVal(next === -1 ? '' : history[history.length - 1 - next] ?? '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cands = COMMANDS.map((c) => c.cmd).filter((c) => c.startsWith(val));
      if (cands.length === 1) setVal(cands[0]);
    }
  };

  return (
    <div
      className={s.inputWrap}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={s.inputRow}>
        <Prompt cwd={cwd} />
        {mobile && <br />}
        <div className={s.inputInner}>
          <input
            ref={inputRef}
            className={s.inputField}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Run a command in the terminal"
          />
        </div>
      </div>
    </div>
  );
}

// ── Command picker (⌘K) ──
function Picker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (cmd: string) => void;
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  if (!open) return null;

  const items = COMMANDS.filter(
    (c) =>
      c.cmd.toLowerCase().includes(q.toLowerCase()) ||
      c.desc.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className={s.pickerOverlay} onClick={onClose}>
      <div className={s.pickerModal} onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className={s.pickerSearch}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="run a command…"
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter' && items[0]) onPick(items[0].cmd);
          }}
        />
        <div className={s.pickerList}>
          {items.map((it, idx) => (
            <button
              key={it.cmd}
              className={s.pickerItem}
              data-first={idx === 0 ? 'true' : undefined}
              onClick={() => onPick(it.cmd)}
            >
              <span className={s.pickerItemCmd}>{it.cmd}</span>
              <span className={s.pickerItemDesc}>{it.desc}</span>
            </button>
          ))}
        </div>
        <div className={s.pickerFooter}>
          <span>↵ run</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

// ── Topbar ──
function TopBar({ onPicker, mobile }: { onPicker: () => void; mobile: boolean }) {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={s.topbar}>
      <div className={s.topbarLeft}>
        <span className={`${s.dot} ${s.dotRed}`} />
        <span className={`${s.dot} ${s.dotYellow}`} />
        <span className={`${s.dot} ${s.dotGreen}`} />
        {!mobile && (
          <span className={s.topbarLabel}>
            {PROFILE.user}@{PROFILE.host} — zsh
          </span>
        )}
      </div>
      <div className={s.topbarRight}>
        {!mobile && (
          <span className={s.topbarClock}>
            {t.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        )}
        <button className={s.pickerBtn} onClick={onPicker}>
          {mobile ? 'cmds' : '⌘K'}
        </button>
      </div>
    </div>
  );
}

// ── Boot log data ──
const BOOT_LOG: BootLine[] = [
  { msg: '[    0.000000] hahnzilla bios v3.2 — POST...', tone: 'dim' },
  { msg: '[    0.214] mounting /home/david   ', status: 'ok' },
  { msg: '[    0.398] loading david.profile  ', status: 'ok' },
  { msg: '[    0.612] starting backend.engineer.service', status: 'ok' },
  { msg: '[    0.804] linking shopify.guild  ', status: 'ok' },
  { msg: '[    1.041] ./projects/felt — pid 4071', status: 'ok' },
  { msg: '[    1.260] coffee.sh — re-brewing', status: 'warn' },
  { msg: '[    1.482] systemd: 14 services started, 0 failed.', tone: 'green' },
  { msg: '', tone: 'dim' },
  { msg: 'welcome back, friend. session ready.', tone: 'fg', delay: 320 },
];

const BOOT_SCRIPT = ['neofetch', 'cat about.txt', 'tree skills/', 'ls projects/'];

const SUGGESTIONS = ['help', 'ls projects/', 'cat about.txt', 'tree skills/', 'curl -s api/me'];

// ── Terminal ──
export function Terminal({ autoBoot = true }: { autoBoot?: boolean }) {
  const cwd = '~';
  const { mobile } = useViewport();
  const [extra, setExtra] = useState<Entry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { transcript: bootEntries, typing, bootLines, done, clearAll } = useBootSequence(
    BOOT_SCRIPT,
    cwd,
    autoBoot,
    BOOT_LOG,
    resolveCommand,
    (props) => <NotFound {...props} />,
  );

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPickerOpen((v) => !v);
      }
      if (e.key === 'Escape') setPickerOpen(false);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  // auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) {
        setExtra((e) => [...e, { input: '', cwd, output: null, key: Date.now() }]);
        return;
      }
      setHistory((h) => [...h, trimmed]);
      if (trimmed === 'clear') {
        setExtra([]);
        clearAll();
        return;
      }
      const resolved = resolveCommand(trimmed);
      const ctx = {
        setOpenProject: (slug: string) => run(`cat projects/${slug}/README.md`),
        clear: () => { setExtra([]); clearAll(); },
      };
      const output = resolved
        ? resolved.cmd.run(resolved.match, ctx)
        : <NotFound cmd={trimmed} />;
      setExtra((e) => [...e, { input: trimmed, cwd, output, key: Date.now() }]);
    },
    [cwd],
  );

  const suggestions = useMemo(() => SUGGESTIONS, []);

  return (
    <div className={s.root}>
      <div className={s.scanlines} />
      <TopBar onPicker={() => setPickerOpen(true)} mobile={mobile} />

      <div
        ref={scrollRef}
        className={s.scroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        onClick={() => {
          const sel = window.getSelection();
          if (!sel || sel.isCollapsed) {
            document.querySelector<HTMLInputElement>(`.${s.inputField}`)?.focus();
          }
        }}
      >
        {/* initial blinking cursor before boot starts */}
        {!done && bootEntries.length === 0 && !typing && bootLines.length === 0 && (
          <div className={s.blockCmd}>
            <Prompt cwd={cwd} />
            <Cursor />
          </div>
        )}

        {/* boot log */}
        {bootLines.length > 0 && (
          <div className={s.bootLog}>
            {bootLines.map((line, i) => (
              <div key={i} className={s.bootLine} data-tone={line.tone ?? 'dim'}>
                {line.msg}
                {line.status === 'ok' && (
                  <span>{'  [ '}<span className={s.bootOk}>OK</span>{' ]'}</span>
                )}
                {line.status === 'warn' && (
                  <span>{'  [ '}<span className={s.bootWarn}>WARN</span>{' ]'}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* auto-typed transcript */}
        {bootEntries.map((e, i) => (
          <Block key={e.key} entry={{ ...e, first: i === 0 }} />
        ))}

        {/* currently typing */}
        {typing && (
          <div className={`${s.block}${bootEntries.length === 0 ? ` ${s.blockFirst}` : ''}`}>
            <div className={s.blockCmd}>
              <Prompt cwd={typing.cwd} />
              <span>{typing.input}</span>
              <Cursor />
            </div>
          </div>
        )}

        {/* user-run entries */}
        {extra.map((e) => (
          <Block key={e.key} entry={e} />
        ))}

        {done && (
          <InputLine cwd={cwd} history={history} onRun={run} mobile={mobile} />
        )}
      </div>

      {/* mobile chip strip */}
      {mobile && done && (
        <div className={s.chipStrip}>
          {suggestions.map((sug) => (
            <button key={sug} className={s.chip} onClick={() => run(sug)}>
              {sug}
            </button>
          ))}
        </div>
      )}

      <Picker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(c) => {
          setPickerOpen(false);
          run(c);
        }}
      />
    </div>
  );
}
