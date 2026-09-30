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
  {
    slug: 'buschleague',
    name: 'buschleague',
    type: 'd',
    status: 'live',
    blurb: 'live scoreboard for a backyard tournament',
    description:
      "For two summers, a backyard tournament ran on paper scorecards and one guy's spreadsheet. Nobody knew who was winning until the end of the night, when the math got done and the results came out all at once. Busch League puts the scoreboard on a projector. Players scan a QR code, log their own cornhole throws and flip-cup times, and the standings reshuffle live on the garage door. The big screen rotates between game leaders, blowouts, records and a roast of whoever's in last place. Hosts can now run their own league with the same setup.",
    stack: ['rails-8', 'react', 'postgresql', 'action-cable', 'fly.io', 'netlify'],
    metrics: [
      ['players on launch night', '13'],
      ['scores logged, zero napkins', '91'],
      ['big-board panel types', '19'],
      ['lines of code', '~6.9k'],
    ],
    repo: 'buschleague.hahnzilla.com',
    commits: [
      ['2b93bfc', 'roast panels and ticker lines on the big board'],
      ['257c1d4', 'landing page, self-serve hosting, sign-in rate limits'],
      ['445200d', 'initial commit'],
    ],
  },
];
