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
      blurb: 'Home base. Eleven years in and it\'s still how I think — every other language is a translation.',
    },
    {
      name: 'php',
      years: 7,
      url: 'https://www.php.net',
      blurb: 'My past, mostly. Laravel at Moment, Craft Commerce at 40D. More capable than its reputation, and I have the production scars to prove it.',
    },
    {
      name: 'javascript',
      years: 10,
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      blurb: 'Always present. I don\'t think about it much — it\'s just the air the web runs on.',
    },
    {
      name: 'typescript',
      years: 5,
      url: 'https://www.typescriptlang.org',
      blurb: 'Didn\'t love it at first. Now I wouldn\'t go back — it\'s the thing that keeps me from shipping my own mistakes.',
    },
  ],
  frameworks: [
    {
      name: 'rails',
      years: 11,
      url: 'https://rubyonrails.org',
      blurb: 'Gets out of my way. After eleven years it just works — I think about the problem, not the framework.',
    },
    {
      name: 'laravel',
      years: 5,
      url: 'https://laravel.com',
      blurb: 'Built real production APIs with it at Moment and 40D. The Rails of PHP, in all the right ways.',
    },
    {
      name: 'react',
      years: 6,
      url: 'https://react.dev',
      blurb: 'I\'ll use it when the project earns it. I\'m a backend engineer and I\'m fine with that.',
    },
  ],
  data: [
    {
      name: 'postgresql',
      years: 10,
      url: 'https://www.postgresql.org',
      blurb: 'My default. No drama about it — just always the right call.',
    },
    {
      name: 'mysql',
      years: 9,
      url: 'https://www.mysql.com',
      blurb: 'Muscle memory from years in PHP-land. I know Postgres is the right call. I still reach for MySQL anyway.',
    },
    {
      name: 'redis',
      years: 8,
      url: 'https://redis.io',
      blurb: 'Duct tape. I\'ve used it for caching, queues, rate limiting, sessions — things it was and wasn\'t designed for. Handles all of it.',
    },
    {
      name: 'graphql',
      years: 6,
      url: 'https://graphql.org',
      blurb: 'Used it. Have opinions. Mostly the opinion is: REST was probably fine.',
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
      name: 'claude',
      years: 2,
      url: 'https://claude.ai',
      blurb: 'AI pair programmer and thinking partner. It wrote some of the code on this very site.',
    },
  ],
};
