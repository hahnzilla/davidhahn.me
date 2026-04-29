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

// ── Virtual filesystem ──
function buildVirtualFS(): Record<string, string[]> {
  const fs: Record<string, string[]> = {
    '~': ['about.txt', 'projects/', 'skills/'],
    '~/projects': PROJECTS.map((p) => `${p.slug}/`),
    '~/skills': Object.keys(SKILLS_TREE).map((k) => `${k}/`),
  };
  for (const p of PROJECTS) {
    fs[`~/projects/${p.slug}`] = ['README.md'];
  }
  for (const [cat, skills] of Object.entries(SKILLS_TREE)) {
    fs[`~/skills/${cat}`] = skills.map((sk) => sk.name);
  }
  return fs;
}

export const VIRTUAL_FS = buildVirtualFS();

// Resolve a path relative to cwd. Returns the canonical ~/… form.
export function resolvePath(cwd: string, input: string): string {
  const trimmed = input.replace(/\/+$/, '');
  if (trimmed === '' || trimmed === '~') return '~';
  if (trimmed.startsWith('~/')) return trimmed;

  const parts = cwd === '~' ? ['~'] : cwd.split('/');
  for (const seg of trimmed.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '~') { parts.splice(0, parts.length, '~'); continue; }
    if (seg === '..') { if (parts.length > 1) parts.pop(); continue; }
    parts.push(seg);
  }
  return parts.join('/');
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

// ── LsDir — generic directory listing ──
function LsDir({ entries }: { entries: string[] }) {
  return (
    <div className={s.lsDirGrid}>
      {entries.map((e) => (
        <span key={e} className={e.endsWith('/') ? s.green : undefined}>
          {e}
        </span>
      ))}
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

// ── CatSkill ──
function CatSkill({ category, name }: { category: string; name: string }) {
  const skill = SKILLS_TREE[category]?.find((sk) => sk.name === name);
  if (!skill) {
    return <NotFound cmd={`cat skills/${category}/${name}`} />;
  }
  return (
    <div className={s.skillWrap}>
      <div className={s.skillPath}>skills/{category}/{name}</div>
      <div className={s.skillSep}>{'─'.repeat(22)}</div>
      <div className={s.skillMeta}>
        <C cls={s.white}>{skill.name}</C>
        <C cls={s.dim}>{'  ·  '}{skill.years}y</C>
      </div>
      <p className={s.skillBlurb}>{skill.blurb}</p>
      <div className={s.skillLink}>
        <C cls={s.dim}>→ </C>
        <a href={skill.url} target="_blank" rel="noreferrer" className={s.readmeLink}>
          {skill.url.replace('https://', '')}
        </a>
      </div>
    </div>
  );
}

// ── RmRf — easter egg deletion sequence ──
function RmRf({ onDestroy }: { onDestroy: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDestroy, 2200);
    return () => clearTimeout(t);
  }, [onDestroy]);

  return (
    <pre className={s.rmWrap}>{`removed 'about.txt'
removed 'projects/felt/README.md'
removed directory 'projects/felt/'
removed directory 'projects/'
removed directory 'skills/languages/'
removed directory 'skills/frameworks/'
removed directory 'skills/data/'
removed directory 'skills/tools/'
removed directory 'skills/'

Segmentation fault (core dumped)`}</pre>
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
  const visible = commands.filter((c) => !c.hidden);
  return (
    <div className={s.helpWrap}>
      <div className={s.helpHeader}>available commands:</div>
      <div className={s.helpGrid}>
        {visible.map((c) => (
          <Fragment key={c.cmd}>
            <C cls={s.green}>{c.cmd}</C>
            <C cls={s.dim}>{c.desc}</C>
          </Fragment>
        ))}
      </div>
      <div className={s.helpFooter}>
        try <C cls={s.cyan}>cat skills/languages/ruby</C> · use{' '}
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
    cmd: 'ls',
    match: /^ls(\s+(.+))?$/,
    desc: 'list directory contents',
    run: (m, ctx) => {
      const rawPath = m?.[2]?.trim();
      const target = rawPath ? resolvePath(ctx.cwd, rawPath) : ctx.cwd;
      if (target === '~/projects') {
        return <LsProjects onOpen={ctx.setOpenProject} />;
      }
      const entries = VIRTUAL_FS[target];
      if (!entries) {
        return (
          <span className={s.notFoundWrap}>
            ls: cannot access '{rawPath ?? '.'}': No such file or directory
          </span>
        );
      }
      return <LsDir entries={entries} />;
    },
  },
  {
    cmd: 'cd',
    match: /^cd(\s+(.+))?$/,
    desc: 'change directory',
    run: (m, ctx) => {
      const rawPath = m?.[2]?.trim();
      if (!rawPath || rawPath === '~') {
        ctx.setCwd('~');
        return null;
      }
      const resolved = resolvePath(ctx.cwd, rawPath);
      if (VIRTUAL_FS[resolved] !== undefined) {
        ctx.setCwd(resolved);
        return null;
      }
      return (
        <span className={s.notFoundWrap}>
          cd: no such file or directory: {rawPath}
        </span>
      );
    },
  },
  {
    cmd: 'pwd',
    desc: 'print working directory',
    run: (_, ctx) => (
      <span>{ctx.cwd.replace('~', `/home/${PROFILE.user}`)}</span>
    ),
  },
  {
    cmd: 'cat projects/felt/README.md',
    match: /^cat\s+projects\/(\w+)\/README\.md$/,
    desc: 'read project README',
    run: (m) => <CatReadme slug={m ? m[1] : 'felt'} />,
  },
  {
    cmd: 'cat skills/languages/ruby',
    match: /^cat\s+skills\/(\w[\w-]*)\/(\w[\w-]*)$/,
    desc: 'read a skill file',
    run: (m) => <CatSkill category={m![1]} name={m![2]} />,
  },
  {
    cmd: 'cat <file>',
    match: /^cat\s+(.+)$/,
    desc: 'read a file',
    hidden: true,
    run: (m, ctx) => {
      const rawPath = m![1].trim();
      const resolved = resolvePath(ctx.cwd, rawPath);

      if (resolved === '~/about.txt') return <CatAbout />;

      const readmeMatch = resolved.match(/^~\/projects\/(\w+)\/README\.md$/);
      if (readmeMatch) return <CatReadme slug={readmeMatch[1]} />;

      const skillMatch = resolved.match(/^~\/skills\/(\w[\w-]*)\/(\w[\w-]*)$/);
      if (skillMatch) return <CatSkill category={skillMatch[1]} name={skillMatch[2]} />;

      if (VIRTUAL_FS[resolved] !== undefined) {
        return (
          <span className={s.notFoundWrap}>cat: {rawPath}: Is a directory</span>
        );
      }
      return (
        <span className={s.notFoundWrap}>
          cat: {rawPath}: No such file or directory
        </span>
      );
    },
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
    run: (_, ctx) => { ctx.clear(); return null; },
  },
  {
    cmd: 'rm -rf .',
    match: /^rm\s+(-rf|-fr)(\s+\S+)?\s*$/,
    desc: 'delete everything',
    hidden: true,
    run: (_, ctx) => <RmRf onDestroy={ctx.destroy} />,
  },
];

// ── Tab completion ──
const PATH_VERBS = new Set(['cd', 'ls', 'cat', 'tree']);

function completePathArg(partial: string, cwd: string, dirsOnly: boolean): string[] {
  const lastSlash = partial.lastIndexOf('/');
  const dirPart = lastSlash === -1 ? '' : partial.slice(0, lastSlash);
  const prefix = lastSlash === -1 ? partial : partial.slice(lastSlash + 1);

  const targetDir = dirPart ? resolvePath(cwd, dirPart) : cwd;
  const entries = VIRTUAL_FS[targetDir];
  if (!entries) return [];

  return entries
    .filter((e) => e.startsWith(prefix) && (!dirsOnly || e.endsWith('/')))
    .map((e) => (dirPart ? `${dirPart}/${e}` : e));
}

export function getCompletions(val: string, cwd: string): string[] {
  const trimmed = val.trimStart();
  const spaceIdx = trimmed.indexOf(' ');

  if (spaceIdx === -1) {
    // Completing the verb — deduplicate (cat appears multiple times in COMMANDS)
    const verbs = [...new Set(COMMANDS.filter((c) => !c.hidden).map((c) => c.cmd.split(' ')[0]))];
    return verbs.filter((v) => v.startsWith(trimmed));
  }

  const verb = trimmed.slice(0, spaceIdx);
  const rest = trimmed.slice(spaceIdx + 1);

  if (PATH_VERBS.has(verb)) {
    const paths = completePathArg(rest, cwd, verb === 'cd');
    return paths.map((p) => `${verb} ${p}`);
  }

  // Fall back to full command-string matching
  return COMMANDS.filter((c) => !c.hidden && c.cmd.startsWith(trimmed)).map((c) => c.cmd);
}

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
