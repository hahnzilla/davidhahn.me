export interface Project {
  slug: string;
  name: string;
  type: string;
  status: string;
  blurb: string;
  description: string;
  stack: string[];
  metrics: [string, string][];
  repo: string;
  commits: [string, string][];
}

export const PROJECTS: Project[] = [
  {
    slug: 'felt',
    name: 'felt',
    type: 'd',
    status: 'live',
    blurb: 'real-time poker chip tracker for home games',
    description:
      'Replace the chip set with your phone — everyone joins a table, bets, raises, and folds in real time. Built to stress-test Action Cable at low latency under unreliable home wifi.',
    stack: ['rails-8', 'react', 'postgresql', 'action-cable'],
    metrics: [
      ['p50 broadcast latency', '34ms'],
      ['concurrent tables', '120+'],
      ['lines of code', '~4.2k'],
    ],
    repo: 'github.com/hahnzilla/felt',
    commits: [
      ['a3f12e0', 'reduce chip render thrash under load'],
      ['881cc4d', 'action cable reconnect with backoff'],
      ['4fa0192', 'initial commit'],
    ],
  },
];
