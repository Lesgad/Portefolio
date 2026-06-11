import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const { status, error, login } = useAuth()
  const location = useLocation()

  if (status === 'authenticated') {
    const state = location.state as LocationState | null
    return <Navigate to={state?.from?.pathname ?? '/admin/projects'} replace />
  }

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center text-center" style={{ gap: '16px' }}>
        <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#25282B' }}>
          Connexion
        </h1>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>
          Connectez-vous avec votre compte Google pour accéder à l'administration.
        </p>
        <button
          type="button"
          onClick={() => login()}
          disabled={status === 'loading'}
          style={{
            display: 'inline-block',
            backgroundColor: '#FDC435',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#25282B',
            border: 'none',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Se connecter avec Google
        </button>
        {error && (
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#E0654F' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
