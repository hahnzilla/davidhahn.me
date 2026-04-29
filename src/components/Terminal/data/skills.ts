export interface Skill {
  name: string;
  years: number;
  url: string;
  blurb: string;
}

export const SKILLS_TREE: Record<string, Skill[]> = {
  languages: [
    {
      name: 'ruby',
      years: 11,
      url: 'https://www.ruby-lang.org',
      blurb: 'My longest-running language. The one I reach for when I want to move fast and write code that reads like prose.',
    },
    {
      name: 'php',
      years: 7,
      url: 'https://www.php.net',
      blurb: 'Spent years deep in the Laravel and WordPress ecosystems. More capable than its reputation suggests.',
    },
    {
      name: 'javascript',
      years: 10,
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      blurb: 'Full-stack glue. I use it wherever I need the browser and the server to speak the same language.',
    },
    {
      name: 'typescript',
      years: 5,
      url: 'https://www.typescriptlang.org',
      blurb: 'JavaScript with a conscience. Non-negotiable on any project I care about shipping correctly.',
    },
  ],
  frameworks: [
    {
      name: 'rails',
      years: 11,
      url: 'https://rubyonrails.org',
      blurb: 'My default backend stack. Convention over configuration means I spend time on problems, not plumbing.',
    },
    {
      name: 'laravel',
      years: 5,
      url: 'https://laravel.com',
      blurb: 'The Rails of PHP. Elegant, well-documented, and full-featured — I built production APIs with it for years.',
    },
    {
      name: 'react',
      years: 6,
      url: 'https://react.dev',
      blurb: 'Frontend when I need it. I reach for it on projects where the UI complexity earns its weight.',
    },
  ],
  data: [
    {
      name: 'postgresql',
      years: 10,
      url: 'https://www.postgresql.org',
      blurb: 'My default database. Reliable, feature-rich, and capable of things most people never discover.',
    },
    {
      name: 'mysql',
      years: 9,
      url: 'https://www.mysql.com',
      blurb: 'Where I cut my teeth on relational databases. Still powering millions of queries in production somewhere.',
    },
    {
      name: 'redis',
      years: 8,
      url: 'https://redis.io',
      blurb: 'Cache, queue, pub/sub — Redis does it all. I reach for it whenever latency matters.',
    },
    {
      name: 'graphql',
      years: 6,
      url: 'https://graphql.org',
      blurb: 'Elegant API layer for complex data graphs. I have opinions about when to use it and when REST is fine.',
    },
  ],
  tools: [
    {
      name: 'git',
      years: 12,
      url: 'https://git-scm.com',
      blurb: 'The tool I use more than any other. I think in commits and branches.',
    },
    {
      name: 'docker',
      years: 7,
      url: 'https://www.docker.com',
      blurb: 'Containers changed how I think about environments. Dev/prod parity without the headache.',
    },
    {
      name: 'kafka',
      years: 4,
      url: 'https://kafka.apache.org',
      blurb: 'Event streaming at Shopify scale. When you need guaranteed delivery and replay, nothing beats it.',
    },
    {
      name: 'claude',
      years: 2,
      url: 'https://claude.ai',
      blurb: 'AI pair programmer and thinking partner. It wrote some of the code on this very site.',
    },
  ],
};
