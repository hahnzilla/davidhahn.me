import ProfilePhoto from './components/ProfilePhoto'
import SocialLinks from './components/SocialLinks'

const skills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'PostgreSQL',
  'GraphQL', 'Docker', 'Kubernetes', 'Go',
]

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16">
      <main className="text-center max-w-xl">
        <ProfilePhoto />

        <h1 className="mt-6 text-5xl font-light tracking-wide text-gray-800 sm:text-6xl">
          David Hahn
        </h1>

        <p className="mt-4 text-lg font-light text-slate-500 sm:text-xl leading-relaxed">
          The future of your yesterday is my now.
        </p>

        <p className="mt-6 text-base text-slate-600 leading-relaxed">
          Software engineer passionate about building products that make a difference.
          I love working across the stack, from crafting clean APIs to polishing pixel-perfect UIs.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
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
