import { useReducer, type FormEvent } from 'react'
import { contactSchema, type ContactFormValues } from '../schemas/contact'
import { submitContactMessage } from '../services/contacts'
import { sendContactEmail } from '../services/email'

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

const people = [
  {
    name: 'Maël Gadou',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/maelgadou/', icon: <InstagramIcon /> },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maël-gadou-489678295/', icon: <LinkedInIcon /> },
      { label: 'Email', href: 'mailto:mael.gadou@yopmail.com', icon: <EmailIcon /> },
    ],
  },
  {
    name: 'Marie Tassel',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marie-tassel-8129152bb', icon: <LinkedInIcon /> },
    ],
  },
]

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
    <section id="contact" style={{ backgroundColor: '#F5F6FA', position: 'relative', overflow: 'hidden', paddingTop: '40px', paddingBottom: '160px' }}>

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
      <form style={{ width: '400px', margin: '32px auto 0', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>

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
            rows={4}
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

      {/* Réseaux sociaux + copyright */}
      <div className="flex flex-col items-center" style={{ position: 'relative', zIndex: 1, gap: '24px', marginTop: '32px' }}>
        <div className="flex flex-wrap items-start justify-center" style={{ gap: '64px' }}>
          {people.map((person) => (
            <div key={person.name} className="flex flex-col items-center" style={{ gap: '12px' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: '#25282B' }}>
                {person.name}
              </span>
              <div className="flex items-center" style={{ gap: '12px' }}>
                {person.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} ${person.name}`}
                    className="flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#25282B', color: '#FFFFFF' }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282', margin: 0 }}>
          Maël Gadou & Marie Tassel — 2026
        </p>
      </div>

      {/* Vague jaune décorative */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '160px', zIndex: 0 }}
      >
        <path d="M0,100 C 200,180 400,200 600,180 C 760,150 1080,60 1440,20 L1440,320 L0,320 Z" fill="#FDC435" />
      </svg>

    </section>
  )
}
