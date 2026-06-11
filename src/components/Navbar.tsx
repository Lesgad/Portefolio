import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navLinks = [
  { label: 'À propos', href: '#apropos' },
  { label: 'Projets', href: '#projets' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Contact', href: '#contact' },
]

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.5404-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5827-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
      <path fill="#FBBC05" d="M3.9641 10.71c-.18-.5404-.2823-1.1168-.2823-1.71s.1023-1.1696.2823-1.71V4.9582H.9573C.3477 6.1718 0 7.5477 0 9s.3477 2.8282.9573 4.0418L3.9641 10.71z" />
      <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5814-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1623 6.6564 3.5795 9 3.5795z" />
    </svg>
  )
}

export default function Navbar() {
  const { status, user, error, login } = useAuth()

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'transparent' }} className="w-full">
      <nav className="relative max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">

        {/* Nom / Logo */}
        <a
          href="#"
          className="text-gray-900 font-medium text-sm tracking-wide hover:opacity-70 transition-opacity"
        >
          Maël Gadou & Marie Tassel
        </a>

        {/* Liens de navigation */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
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

        {/* Connexion */}
        {status === 'authenticated' && (
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gray-400">
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
            <span>Administration</span>
          </Link>
        )}

        {status === 'unauthenticated' && (
          <button
            type="button"
            onClick={() => login()}
            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            <span>Connexion</span>
          </button>
        )}

        {error && (
          <span className="absolute top-full right-8 mt-1 text-xs text-red-500 whitespace-nowrap">
            {error}
          </span>
        )}

      </nav>
    </header>
  )
}
