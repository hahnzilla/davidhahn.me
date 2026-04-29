import { useState, useEffect, Fragment } from 'react';
import type { Command } from '../types';
import { PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { SKILLS_TREE } from '../data/skills';
import { PROCS, type Proc } from '../data/procs';
import s from './commands.module.css';

// ── shared ──
function C({ cls, children }: { cls: string; children: React.ReactNode }) {
  return <span className={cls}>{children}</span>;
}

// ── Neofetch ──
export function Neofetch() {
  const labels: [string, React.ReactNode][] = [
    ['', <><C cls={s.green}>{PROFILE.user}</C><C cls={s.fg}>@</C><C cls={s.yellow}>{PROFILE.host}</C></>],
    ['', <C cls={s.dim}>─────────────────</C>],
    ['OS', 'macOS Sequoia 15'],
    ['Shell', 'zsh 5.9'],
    ['Editor', 'VS Code'],
    ['Role', <><span>{PROFILE.role} @ </span><C cls={s.green}>{PROFILE.company}</C></>],
    ['Location', PROFILE.location],
    ['Uptime', `${PROFILE.uptimeYears} years`],
    ['Email', PROFILE.email],
    ['Repos', PROFILE.github],
  ];
  return (
    <div className={s.neofetchGrid}>
      <pre className={s.neofetchAscii}>{`     .--.
    |o_o |
    |:_/ |
   //   \\ \\
  (|     | )
 /'\\_   _/\`\\
 \\___)=(___/`}</pre>
      <div className={s.neofetchInfo}>
        {labels.map(([k, v], i) => (
          <div key={i} className={s.neofetchRow}>
            {k && <C cls={s.cyan}>{k}</C>}
            {k && <C cls={s.dim}>: </C>}
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CatAbout ──
export function CatAbout() {
  return (
    <div className={s.aboutWrap}>
      <div className={s.aboutComment}># about.txt — last edited 2026-04-01</div>
      <p className={s.aboutBody}>
        I'm <C cls={s.white}>{PROFILE.fullName}</C>, a backend engineer at{' '}
        <C cls={s.green}>{PROFILE.company}</C>. I build the systems you never see and
        the APIs you can't live without. Happiest deep in server-side code —
        making things faster, more reliable, and less likely to page me at 2am.
      </p>
      <p className={s.aboutTagline}>"{PROFILE.tagline}"</p>
    </div>
  );
}

// ── LsProjects ──
export function LsProjects({ onOpen }: { onOpen?: (slug: string) => void }) {
  return (
    <div>
      <div className={s.lsHeader}>total {PROJECTS.length}</div>
      {PROJECTS.map((p) => (
        <button
          key={p.slug}
          className={s.lsRow}
          onClick={() => onOpen?.(p.slug)}
        >
          <C cls={s.dim}>{p.type}</C>
          <C cls={s.green}>{p.name}/</C>
          <C cls={s.orange}>● {p.status}</C>
          <C cls={s.dim}>{p.blurb}</C>
        </button>
      ))}
      <div className={s.lsHint}>
        hint: <C cls={s.cyan}>cat projects/&lt;name&gt;/README.md</C> for details
      </div>
    </div>
  );
}

// ── CatReadme ──
export function CatReadme({ slug }: { slug: string }) {
  const p = PROJECTS.find((x) => x.slug === slug) ?? PROJECTS[0];
  return (
    <div className={s.readmeWrap}>
      <div className={s.readmeComment}># projects/{p.slug}/README.md</div>
      <h2 className={s.readmeH2}>
        <C cls={s.dim}>## </C>{p.name}
      </h2>
      <p className={s.readmePara}>{p.description}</p>

      <div className={s.readmeSectionLabel}>### stack</div>
      <div className={s.readmeStack}>
        {p.stack.map((tech) => (
          <span key={tech} className={s.readmeChip}>{tech}</span>
        ))}
      </div>

      <div className={s.readmeSectionLabel}>### metrics</div>
      <table className={s.readmeMetrics}>
        <tbody>
          {p.metrics.map(([k, v]) => (
            <tr key={k}>
              <td className={s.readmeMetricKey}>{k}</td>
              <td className={s.readmeMetricVal}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={s.readmeSectionLabel}>### links</div>
      <div className={s.readmeLinks}>
        <C cls={s.dim}>→ </C>
        <a
          href={`https://${p.repo}`}
          target="_blank"
          rel="noreferrer"
          className={s.readmeLink}
        >
          {p.repo}
        </a>
      </div>
    </div>
  );
}

// ── TreeSkills ──
export function TreeSkills() {
  const groups = Object.entries(SKILLS_TREE);
  const totalFiles = Object.values(SKILLS_TREE).flat().length;
  return (
    <pre className={s.treeWrap}>
      <C cls={s.green}>skills/</C>
      {'\n'}
      {groups.map(([g, items], gi) => {
        const lastG = gi === groups.length - 1;
        return (
          <Fragment key={g}>
            <C cls={s.dim}>{lastG ? '└── ' : '├── '}</C>
            <C cls={s.green}>{g}/</C>
            {'\n'}
            {items.map((it, i) => {
              const last = i === items.length - 1;
              return (
                <Fragment key={it.name}>
                  <C cls={s.dim}>{lastG ? '    ' : '│   '}{last ? '└── ' : '├── '}</C>
                  <span>{it.name}</span>
                  <C cls={s.dim}>{`  · ${it.years}y`}</C>
                  {'\n'}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
      <C cls={s.dim}>{'\n'}{totalFiles} files</C>
    </pre>
  );
}

// ── TopProcs ──
export function TopProcs() {
  const [procs, setProcs] = useState<Proc[]>(PROCS);

  useEffect(() => {
    const tick = () => {
      setProcs((ps) =>
        ps.map((p) => ({
          ...p,
          cpu: Math.max(0.1, Math.min(99.9, p.cpu + (Math.random() - 0.5) * 4)),
          mem: Math.max(0.1, Math.min(99.9, p.mem + (Math.random() - 0.5) * 0.6)),
        })),
      );
    };
    const id = setInterval(tick, 1100);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') clearInterval(id);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const totalCpu = procs.reduce((sum, p) => sum + p.cpu, 0);

  return (
    <div className={s.topWrap}>
      <div className={s.topHeader}>
        Tasks: <C cls={s.fg}>{procs.length} total</C>
        <span style={{ marginLeft: 16 }}>
          %CPU(s): <C cls={s.orange}>{totalCpu.toFixed(1)}</C>
        </span>
      </div>
      <div className={s.topColHeaders}>
        <span>PID</span>
        <span>COMMAND</span>
        <span className={s.topColRight}>%CPU</span>
        <span className={s.topColRight}>%MEM</span>
        <span className={s.topColRight}>TIME</span>
      </div>
      {procs.map((p) => (
        <div key={p.pid} className={s.topRow}>
          <C cls={s.dim}>{p.pid}</C>
          <span>{p.cmd}</span>
          <span className={s.topCpu} data-high={p.cpu > 30 ? 'true' : 'false'}>
            {p.cpu.toFixed(1)}
          </span>
          <span className={s.topMem}>{p.mem.toFixed(1)}</span>
          <C cls={s.dim}>{p.time}</C>
        </div>
      ))}
    </div>
  );
}

// ── GitLog ──
export function GitLog({ project }: { project: string }) {
  const p = PROJECTS.find((x) => x.slug === project) ?? PROJECTS[0];
  return (
    <div className={s.gitLogWrap}>
      {p.commits.map(([hash, msg]) => (
        <div key={hash}>
          <C cls={s.orange}>{hash}</C>{' '}<span>{msg}</span>
        </div>
      ))}
    </div>
  );
}

// ── Help ──
export function Help({ commands }: { commands: Command[] }) {
  return (
    <div className={s.helpWrap}>
      <div className={s.helpHeader}>available commands:</div>
      <div className={s.helpGrid}>
        {commands.map((c) => (
          <Fragment key={c.cmd}>
            <C cls={s.green}>{c.cmd}</C>
            <C cls={s.dim}>{c.desc}</C>
          </Fragment>
        ))}
      </div>
      <div className={s.helpFooter}>
        try <C cls={s.cyan}>cat projects/felt/README.md</C> · use{' '}
        <C cls={s.cyan}>↑/↓</C> for history · <C cls={s.cyan}>clear</C> to reset
      </div>
    </div>
  );
}

// ── NotFound ──
export function NotFound({ cmd }: { cmd: string }) {
  return (
    <div className={s.notFoundWrap}>
      zsh: command not found: {cmd}
      <div className={s.notFoundHint}>
        type <C cls={s.cyan}>help</C> to see what's available
      </div>
    </div>
  );
}

// ── CurlJson ──
export function CurlJson() {
  const json: Record<string, string | boolean> = {
    name: PROFILE.fullName,
    role: PROFILE.role,
    company: PROFILE.company,
    location: PROFILE.location,
    available: true,
    contact: PROFILE.email,
  };
  return (
    <pre className={s.curlWrap}>
      <C cls={s.dim}>HTTP/2 200 OK</C>{'\n'}
      <C cls={s.dim}>content-type: application/json</C>{'\n\n'}
      <C cls={s.fg}>{'{'}</C>{'\n'}
      {Object.entries(json).map(([k, v], i, arr) => (
        <Fragment key={k}>
          {'  '}
          <C cls={s.cyan}>"{k}"</C>
          <C cls={s.fg}>: </C>
          {typeof v === 'string' ? (
            <C cls={s.magenta}>"{v}"</C>
          ) : (
            <C cls={s.orange}>{String(v)}</C>
          )}
          {i < arr.length - 1 ? <C cls={s.fg}>,</C> : null}
          {'\n'}
        </Fragment>
      ))}
      <C cls={s.fg}>{'}'}</C>
    </pre>
  );
}

// ── Cal ──
export function Cal() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={s.calWrap}>
      <div className={s.calTitle}>{month}</div>
      <div className={s.calGrid}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className={s.calCell}>{d}</span>
        ))}
        {cells.map((d, i) => (
          <span
            key={i}
            className={s.calCell}
            data-today={d === today ? 'true' : undefined}
            data-empty={d === null ? 'true' : undefined}
          >
            {d ?? '·'}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── command registry ──
export const COMMANDS: Command[] = [
  {
    cmd: 'neofetch',
    desc: 'show system info card',
    run: () => <Neofetch />,
  },
  {
    cmd: 'cat about.txt',
    match: /^cat\s+about(\.txt)?$/,
    desc: 'print bio',
    run: () => <CatAbout />,
  },
  {
    cmd: 'ls projects/',
    match: /^ls\s+projects\/?$/,
    desc: 'list projects',
    run: (_, ctx) => <LsProjects onOpen={ctx.setOpenProject} />,
  },
  {
    cmd: 'cat projects/felt/README.md',
    match: /^cat\s+projects\/(\w+)\/README\.md$/,
    desc: 'read project README',
    run: (m) => <CatReadme slug={m ? m[1] : 'felt'} />,
  },
  {
    cmd: 'tree skills/',
    match: /^tree\s+skills\/?(.*)?$/,
    desc: 'list skills as tree',
    run: () => <TreeSkills />,
  },
  {
    cmd: 'curl -s api/me',
    match: /^curl(\s+-s)?\s+api\/me$/,
    desc: 'fetch profile as json',
    run: () => <CurlJson />,
  },
  {
    cmd: 'help',
    desc: 'show available commands',
    run: () => <Help commands={COMMANDS} />,
  },
  {
    cmd: 'clear',
    desc: 'clear the screen',
    run: (_, ctx) => { ctx.clear(); return null; }, // eslint-disable-line @typescript-eslint/no-unused-vars
  },
];

export function resolveCommand(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  for (const c of COMMANDS) {
    if (c.match) {
      const m = trimmed.match(c.match);
      if (m) return { cmd: c, match: m };
    } else if (trimmed === c.cmd) {
      return { cmd: c, match: null };
    }
  }
  return null;
}
