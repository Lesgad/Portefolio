import { useEffect, useReducer, type CSSProperties } from 'react'
import { fetchCollection } from '../../services/firestore'
import { deleteContactMessage, markContactMessageAsRead } from '../../services/contacts'
import LoadingSpinner from '../../components/LoadingSpinner'
import type { ContactMessage } from '../../types/contact'

interface AdminContactsState {
  status: 'loading' | 'success' | 'error'
  messages: ContactMessage[]
  expandedId: string | null
  deleteError: string | null
}

type AdminContactsAction =
  | { type: 'LOAD_SUCCESS'; messages: ContactMessage[] }
  | { type: 'LOAD_ERROR' }
  | { type: 'TOGGLE_EXPAND'; id: string }
  | { type: 'MARK_READ_SUCCESS'; id: string }
  | { type: 'DELETE_SUCCESS'; id: string }
  | { type: 'DELETE_ERROR'; error: string }

const initialState: AdminContactsState = {
  status: 'loading',
  messages: [],
  expandedId: null,
  deleteError: null,
}

function adminContactsReducer(state: AdminContactsState, action: AdminContactsAction): AdminContactsState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success', messages: action.messages }
    case 'LOAD_ERROR':
      return { ...state, status: 'error' }
    case 'TOGGLE_EXPAND':
      return { ...state, expandedId: state.expandedId === action.id ? null : action.id }
    case 'MARK_READ_SUCCESS':
      return {
        ...state,
        messages: state.messages.map((message) => (message.id === action.id ? { ...message, read: true } : message)),
        expandedId: action.id,
      }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        messages: state.messages.filter((message) => message.id !== action.id),
        expandedId: state.expandedId === action.id ? null : state.expandedId,
        deleteError: null,
      }
    case 'DELETE_ERROR':
      return { ...state, deleteError: action.error }
  }
}

const errorStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  color: '#E0654F',
  margin: 0,
}

const dangerButtonStyle: CSSProperties = {
  border: '2px solid #E0654F',
  borderRadius: '8px',
  padding: '10px 24px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 700,
  fontSize: '16px',
  color: '#E0654F',
  backgroundColor: 'transparent',
  cursor: 'pointer',
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminContactsPage() {
  const [state, dispatch] = useReducer(adminContactsReducer, initialState)

  useEffect(() => {
    let cancelled = false

    fetchCollection<ContactMessage>('contacts')
      .then((messages) => {
        if (!cancelled) {
          const sorted = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          dispatch({ type: 'LOAD_SUCCESS', messages: sorted })
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'LOAD_ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleToggle(message: ContactMessage) {
    dispatch({ type: 'TOGGLE_EXPAND', id: message.id })

    if (!message.read) {
      markContactMessageAsRead(message.id)
        .then(() => dispatch({ type: 'MARK_READ_SUCCESS', id: message.id }))
        .catch(() => {
          // marquage non bloquant : on laisse le message visible même si l'écriture échoue
        })
    }
  }

  async function handleDelete(message: ContactMessage) {
    if (!window.confirm(`Supprimer le message de "${message.name}" ?`)) {
      return
    }

    try {
      await deleteContactMessage(message.id)
      dispatch({ type: 'DELETE_SUCCESS', id: message.id })
    } catch {
      dispatch({ type: 'DELETE_ERROR', error: 'Impossible de supprimer ce message.' })
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '28px', color: '#25282B', margin: 0 }}>
        Messages de contact
      </h1>

      {state.deleteError && <p style={errorStyle}>{state.deleteError}</p>}

      {state.status === 'loading' && (
        <div className="flex items-center justify-center" style={{ paddingTop: '24px' }}>
          <LoadingSpinner />
        </div>
      )}

      {state.status === 'error' && <p style={errorStyle}>Impossible de charger les messages.</p>}

      {state.status === 'success' && state.messages.length === 0 && (
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>Aucun message pour le moment.</p>
      )}

      {state.status === 'success' && state.messages.length > 0 && (
        <div className="flex flex-col">
          {state.messages.map((message) => (
            <div key={message.id} style={{ borderBottom: '1px solid #E8ECF4' }}>
              <button
                type="button"
                onClick={() => handleToggle(message)}
                className="flex items-center justify-between w-full text-left"
                style={{ padding: '16px 0', gap: '24px', background: 'none', border: 'none', cursor: 'pointer' }}
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
              </button>

              {state.expandedId === message.id && (
                <div className="flex flex-col" style={{ gap: '16px', paddingBottom: '16px' }}>
                  <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {message.message}
                  </p>
                  <div className="flex" style={{ justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => handleDelete(message)} style={dangerButtonStyle}>
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
