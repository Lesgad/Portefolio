import { useReducer, type FormEvent } from 'react'
import { contactSchema, type ContactFormValues } from '../schemas/contact'
import { submitContactMessage } from '../services/contacts'
import { sendContactEmail } from '../services/email'

type ContactField = keyof ContactFormValues

interface ContactFormState {
  values: ContactFormValues
  errors: Partial<Record<ContactField, string>>
  status: 'idle' | 'submitting' | 'success' | 'error'
}

type ContactFormAction =
  | { type: 'FIELD_CHANGE'; field: ContactField; value: string }
  | { type: 'VALIDATION_ERROR'; errors: Partial<Record<ContactField, string>> }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR' }

const initialState: ContactFormState = {
  values: { name: '', email: '', message: '' },
  errors: {},
  status: 'idle',
}

function contactFormReducer(state: ContactFormState, action: ContactFormAction): ContactFormState {
  switch (action.type) {
    case 'FIELD_CHANGE': {
      const errors = { ...state.errors }
      delete errors[action.field]
      return { ...state, values: { ...state.values, [action.field]: action.value }, errors }
    }
    case 'VALIDATION_ERROR':
      return { ...state, errors: action.errors }
    case 'SUBMIT_START':
      return { ...state, status: 'submitting', errors: {} }
    case 'SUBMIT_SUCCESS':
      return { values: { name: '', email: '', message: '' }, errors: {}, status: 'success' }
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error' }
  }
}

export default function Contact() {
  const [state, dispatch] = useReducer(contactFormReducer, initialState)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const result = contactSchema.safeParse(state.values)

    if (!result.success) {
      const errors: Partial<Record<ContactField, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ContactField
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      dispatch({ type: 'VALIDATION_ERROR', errors })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      await submitContactMessage(result.data)
      await sendContactEmail(result.data)
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch {
      dispatch({ type: 'SUBMIT_ERROR' })
    }
  }

  return (
    <section id="contact" style={{ backgroundColor: '#F5F6FA', paddingTop: '80px', paddingBottom: '80px' }}>

      {/* Titre */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          fontSize: '48px',
          color: '#25282B',
          margin: 0,
        }}>
          Contact
        </h2>
        <div style={{
          width: '48px',
          height: '3px',
          backgroundColor: '#FDC435',
          margin: '12px auto 0',
          borderRadius: '2px',
        }} />
      </div>

      {/* Formulaire */}
      <form style={{ width: '400px', margin: '48px auto 0', display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleSubmit}>

        {/* Nom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Nom
          </label>
          <input
            type="text"
            value={state.values.name}
            onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'name', value: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #E8ECF4',
              backgroundColor: '#FFFFFF',
              paddingLeft: '12px',
              paddingRight: '12px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {state.errors.name && (
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#E0654F', margin: 0 }}>
              {state.errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Email
          </label>
          <input
            type="email"
            value={state.values.email}
            onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'email', value: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #E8ECF4',
              backgroundColor: '#FFFFFF',
              paddingLeft: '12px',
              paddingRight: '12px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {state.errors.email && (
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#E0654F', margin: 0 }}>
              {state.errors.email}
            </p>
          )}
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Message
          </label>
          <textarea
            rows={5}
            value={state.values.message}
            onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'message', value: e.target.value })}
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #E8ECF4',
              backgroundColor: '#FFFFFF',
              padding: '12px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {state.errors.message && (
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#E0654F', margin: 0 }}>
              {state.errors.message}
            </p>
          )}
        </div>

        {/* Statut de soumission */}
        {state.status === 'success' && (
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#3FA34D', margin: 0 }}>
            Votre message a bien été envoyé !
          </p>
        )}
        {state.status === 'error' && (
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#E0654F', margin: 0 }}>
            Une erreur est survenue, veuillez réessayer.
          </p>
        )}

        {/* Bouton Envoyer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={state.status === 'submitting'}
            style={{
              backgroundColor: '#FDC435',
              borderRadius: '8px',
              padding: '10px 24px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#25282B',
              border: 'none',
              cursor: state.status === 'submitting' ? 'default' : 'pointer',
              opacity: state.status === 'submitting' ? 0.7 : 1,
            }}
          >
            {state.status === 'submitting' ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>

      </form>

    </section>
  )
}
