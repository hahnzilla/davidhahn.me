import ProfilePhoto from './components/ProfilePhoto'
import SocialLinks from './components/SocialLinks'

const skills = [
  'Ruby', 'Rails', 'GraphQL', 'REST APIs', 'PostgreSQL',
  'Redis', 'PHP', 'Laravel', 'Claude', 'MySQL',
]

const projects = [
  {
    name: 'Felt',
    url: 'https://felt.hahnzilla.com',
    description: 'Real-time poker chip tracker for home games. Replace the chip set with your phone — everyone joins a table, bets, raises, and folds in real time. Built with Rails 8, React, and Action Cable.',
    tech: ['Rails', 'React', 'PostgreSQL', 'Action Cable'],
  },
]

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <main className="text-center max-w-xl">
        <ProfilePhoto />

        <h1 className="mt-6 text-5xl font-light tracking-wide text-white sm:text-6xl">
          David Hahn
        </h1>

        <p className="mt-4 text-lg font-light text-indigo-300 sm:text-xl leading-relaxed">
          I write code that no one sees.
        </p>

        <p className="mt-6 text-base text-slate-300 leading-relaxed">
          Backend engineer at Shopify. I build the systems you never see and the APIs you can't live without.
          Happiest when I'm deep in server-side code, making things faster, more reliable, and less likely to page me at 2am.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-indigo-200 ring-1 ring-indigo-400/30 backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-12 text-left">
          <h2 className="text-sm font-medium uppercase tracking-widest text-indigo-400 mb-4 text-center">
            Projects
          </h2>
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl bg-white/5 ring-1 ring-white/10 px-5 py-4 hover:bg-white/10 hover:ring-indigo-400/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </span>
                  <svg className="w-4 h-4 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs text-indigo-300/70 bg-indigo-500/10 rounded-full px-2 py-0.5 ring-1 ring-indigo-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        <SocialLinks />
      </main>
    </div>
  )
}

export default App
