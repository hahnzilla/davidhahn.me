import { Github, Linkedin, Mail } from 'lucide-react'

const links = [
  { href: 'https://github.com/dhahn', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/david-michael-hahn', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:davidmichaelhahn@gmail.com', icon: Mail, label: 'Email' },
]

function SocialLinks() {
  return (
    <nav className="mt-8 flex items-center justify-center gap-5" aria-label="Social links">
      {links.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-gray-400 transition-colors duration-200 hover:text-gray-700"
        >
          <Icon size={28} strokeWidth={1.5} />
        </a>
      ))}
    </nav>
  )
}

export default SocialLinks
