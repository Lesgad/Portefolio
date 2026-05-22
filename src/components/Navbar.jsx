
const navLinks = [
  { label: 'À propos', href: '#apropos' },
  { label: 'Projets', href: '#projets' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'transparent' }} className="w-full">
      <nav className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">

        {/* Nom / Logo */}
        <a
          href="#"
          className="text-gray-900 font-medium text-sm tracking-wide hover:opacity-70 transition-opacity"
        >
          Maël Gadou
        </a>

        {/* Liens de navigation */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link, index) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex flex-col items-center gap-[2px] w-[68px] h-7 justify-center group"
              >
                <span
                  className="text-sm transition-colors text-gray-500 group-hover:text-gray-900"
                >
                  {link.label}
                </span>
                <span
                  className="h-[2px] w-full rounded-full transition-all bg-transparent group-hover:bg-gray-300"
                />
              </a>
            </li>
          ))}
        </ul>

      </nav>
    </header>
  )
}
