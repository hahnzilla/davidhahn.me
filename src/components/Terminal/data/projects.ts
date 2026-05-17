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
    blurb: 'poker night minus the setup',
    description:
      'Born out of a Friday night in Montreal where eight people wasted 45 minutes trying to start a game with the wrong app. Felt does one thing: track chips in real time. Share a 6-character code, everyone joins from their phone, bets and folds update instantly on every screen. No rules engine, no subscription, no accounts for guests. You bring the cards.',
    stack: ['rails-8', 'react', 'postgresql', 'action-cable'],
    metrics: [
      ['p50 broadcast latency', '34ms'],
      ['concurrent tables', '120+'],
      ['lines of code', '~4.2k'],
    ],
    repo: 'felt.hahnzilla.com',
    commits: [
      ['a3f12e0', 'reduce chip render thrash under load'],
      ['881cc4d', 'action cable reconnect with backoff'],
      ['4fa0192', 'initial commit'],
    ],
  },
];
