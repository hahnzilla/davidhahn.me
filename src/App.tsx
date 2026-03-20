import ProfilePhoto from './components/ProfilePhoto'
import SocialLinks from './components/SocialLinks'

const skills = [
  'Ruby', 'Rails', 'GraphQL', 'REST APIs', 'PostgreSQL',
  'Redis', 'Sidekiq', 'Docker', 'TypeScript', 'Node.js',
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

        <SocialLinks />
      </main>
    </div>
  )
}

export default App
