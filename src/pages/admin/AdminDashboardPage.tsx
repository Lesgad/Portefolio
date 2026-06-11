import { useEffect, useReducer, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { fetchCollection } from '../../services/firestore'
import LoadingSpinner from '../../components/LoadingSpinner'
import type { Project } from '../../types/project'
import type { Testimonial } from '../../types/testimonial'
import type { ContactMessage } from '../../types/contact'

interface DashboardStats {
  projectsCount: number
  testimonialsCount: number
  messagesCount: number
  unreadMessagesCount: number
}

interface AdminDashboardState {
  status: 'loading' | 'success' | 'error'
  stats: DashboardStats
  recentMessages: ContactMessage[]
}

type AdminDashboardAction =
  | { type: 'LOAD_SUCCESS'; stats: DashboardStats; recentMessages: ContactMessage[] }
  | { type: 'LOAD_ERROR' }

const initialState: AdminDashboardState = {
  status: 'loading',
  stats: { projectsCount: 0, testimonialsCount: 0, messagesCount: 0, unreadMessagesCount: 0 },
  recentMessages: [],
}

function adminDashboardReducer(state: AdminDashboardState, action: AdminDashboardAction): AdminDashboardState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success', stats: action.stats, recentMessages: action.recentMessages }
    case 'LOAD_ERROR':
      return { ...state, status: 'error' }
  }
}

const errorStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  color: '#E0654F',
  margin: 0,
}

const cardStyle: CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E8ECF4',
  borderRadius: '8px',
  padding: '24px',
}

const cardNumberStyle: CSSProperties = {
  fontFamily: '"Playfair Display", serif',
  fontWeight: 700,
  fontSize: '36px',
  color: '#25282B',
}

const cardLabelStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  color: '#828282',
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminDashboardPage() {
  const [state, dispatch] = useReducer(adminDashboardReducer, initialState)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchCollection<Project>('projects'),
      fetchCollection<Testimonial>('testimonials'),
      fetchCollection<ContactMessage>('contacts'),
    ])
      .then(([projects, testimonials, contacts]) => {
        if (cancelled) return

        const recentMessages = [...contacts]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5)

        dispatch({
          type: 'LOAD_SUCCESS',
          stats: {
            projectsCount: projects.length,
            testimonialsCount: testimonials.length,
            messagesCount: contacts.length,
            unreadMessagesCount: contacts.filter((message) => !message.read).length,
          },
          recentMessages,
        })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'LOAD_ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '28px', color: '#25282B', margin: 0 }}>
        Tableau de bord
      </h1>

      {state.status === 'loading' && (
        <div className="flex items-center justify-center" style={{ paddingTop: '24px' }}>
          <LoadingSpinner />
        </div>
      )}

      {state.status === 'error' && <p style={errorStyle}>Impossible de charger les statistiques.</p>}

      {state.status === 'success' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px' }}>
            <div style={cardStyle}>
              <div style={cardNumberStyle}>{state.stats.projectsCount}</div>
              <div style={cardLabelStyle}>Projets</div>
            </div>
            <div style={cardStyle}>
              <div style={cardNumberStyle}>{state.stats.testimonialsCount}</div>
              <div style={cardLabelStyle}>Témoignages</div>
            </div>
            <div style={cardStyle}>
              <div style={cardNumberStyle}>{state.stats.messagesCount}</div>
              <div style={cardLabelStyle}>Messages</div>
            </div>
            <div style={cardStyle}>
              <div style={{ ...cardNumberStyle, color: state.stats.unreadMessagesCount > 0 ? '#FDC435' : '#25282B' }}>
                {state.stats.unreadMessagesCount}
              </div>
              <div style={cardLabelStyle}>Messages non lus</div>
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: '16px' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#25282B', margin: 0 }}>
              Derniers messages
            </h2>

            {state.recentMessages.length === 0 ? (
              <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>Aucun message pour le moment.</p>
            ) : (
              <div className="flex flex-col">
                {state.recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between"
                    style={{ padding: '16px 0', borderBottom: '1px solid #E8ECF4', gap: '24px' }}
                  >
                    <div className="flex items-center" style={{ gap: '12px', minWidth: 0 }}>
                      {!message.read && (
                        <span
                          aria-label="Non lu"
                          style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: '#FDC435', flexShrink: 0 }}
                        />
                      )}
                      <div className="flex flex-col" style={{ gap: '4px', minWidth: 0 }}>
                        <span
                          style={{
                            fontFamily: '"Playfair Display", serif',
                            fontWeight: message.read ? 400 : 700,
                            fontSize: '18px',
                            color: '#25282B',
                          }}
                        >
                          {message.name}
                        </span>
                        <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282' }}>{message.email}</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282', flexShrink: 0 }}>
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/admin/contacts"
              className="hover:underline"
              style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 700, color: '#25282B' }}
            >
              Voir tous les messages
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
