import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="w-full bg-white flex items-center justify-center" style={{ minHeight: '70vh' }}>
      <div className="flex flex-col items-center text-center" style={{ gap: '16px' }}>
        <span
          style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '96px', color: '#FDC435' }}
        >
          404
        </span>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#25282B' }}>
          Page introuvable
        </h1>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#FDC435',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#25282B',
            textDecoration: 'none',
            marginTop: '8px',
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </section>
  )
}
