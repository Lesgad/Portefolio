import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col">
      <header className="bg-[#25282B] text-white px-8 py-4 flex items-center justify-between">
        <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px' }}>
          Administration
        </span>
        <nav className="flex items-center gap-6" style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px' }}>
          <Link to="/admin" className="hover:opacity-70 transition-opacity">Tableau de bord</Link>
          <Link to="/admin/projects" className="hover:opacity-70 transition-opacity">Projets</Link>
          <Link to="/admin/contacts" className="hover:opacity-70 transition-opacity">Contacts</Link>
          <Link to="/admin/testimonials" className="hover:opacity-70 transition-opacity">Témoignages</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Retour au site</Link>
          {user?.email && <span className="opacity-70">{user.email}</span>}
          <button
            type="button"
            onClick={() => logout()}
            className="hover:opacity-70 transition-opacity"
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
          >
            Se déconnecter
          </button>
        </nav>
      </header>
      <main className="flex-1 px-8 py-10">
        <Outlet />
      </main>
    </div>
  )
}
