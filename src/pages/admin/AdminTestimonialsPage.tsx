import { useEffect, useReducer, useState, type CSSProperties, type FormEvent } from 'react'
import { fetchCollection } from '../../services/firestore'
import { createTestimonial, deleteTestimonial, updateTestimonial } from '../../services/testimonials'
import { testimonialSchema, type TestimonialFormValues } from '../../schemas/testimonial'
import LoadingSpinner from '../../components/LoadingSpinner'
import type { Testimonial } from '../../types/testimonial'

type TestimonialField = keyof TestimonialFormValues

interface AdminTestimonialsState {
  status: 'loading' | 'success' | 'error'
  testimonials: Testimonial[]
  formMode: 'closed' | 'create' | 'edit'
  editingId: string | null
  formValues: TestimonialFormValues
  formErrors: Partial<Record<TestimonialField, string>>
  submitStatus: 'idle' | 'submitting' | 'error'
  deleteError: string | null
}

type AdminTestimonialsAction =
  | { type: 'LOAD_SUCCESS'; testimonials: Testimonial[] }
  | { type: 'LOAD_ERROR' }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; testimonial: Testimonial }
  | { type: 'CLOSE_FORM' }
  | { type: 'FIELD_CHANGE'; field: TestimonialField; value: string }
  | { type: 'VALIDATION_ERROR'; errors: Partial<Record<TestimonialField, string>> }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS_CREATE'; testimonial: Testimonial }
  | { type: 'SUBMIT_SUCCESS_EDIT'; testimonial: Testimonial }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'DELETE_SUCCESS'; id: string }
  | { type: 'DELETE_ERROR'; error: string }

const emptyFormValues: TestimonialFormValues = { author: '', role: '', content: '', avatarUrl: '' }

const initialState: AdminTestimonialsState = {
  status: 'loading',
  testimonials: [],
  formMode: 'closed',
  editingId: null,
  formValues: emptyFormValues,
  formErrors: {},
  submitStatus: 'idle',
  deleteError: null,
}

function adminTestimonialsReducer(state: AdminTestimonialsState, action: AdminTestimonialsAction): AdminTestimonialsState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success', testimonials: action.testimonials }
    case 'LOAD_ERROR':
      return { ...state, status: 'error' }
    case 'OPEN_CREATE':
      return {
        ...state,
        formMode: 'create',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        submitStatus: 'idle',
      }
    case 'OPEN_EDIT':
      return {
        ...state,
        formMode: 'edit',
        editingId: action.testimonial.id,
        formValues: {
          author: action.testimonial.author,
          role: action.testimonial.role,
          content: action.testimonial.content,
          avatarUrl: action.testimonial.avatarUrl ?? '',
        },
        formErrors: {},
        submitStatus: 'idle',
      }
    case 'CLOSE_FORM':
      return {
        ...state,
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        submitStatus: 'idle',
      }
    case 'FIELD_CHANGE': {
      const errors = { ...state.formErrors }
      delete errors[action.field]
      return { ...state, formValues: { ...state.formValues, [action.field]: action.value }, formErrors: errors }
    }
    case 'VALIDATION_ERROR':
      return { ...state, formErrors: action.errors }
    case 'SUBMIT_START':
      return { ...state, submitStatus: 'submitting', formErrors: {} }
    case 'SUBMIT_SUCCESS_CREATE':
      return {
        ...state,
        testimonials: [action.testimonial, ...state.testimonials],
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        submitStatus: 'idle',
      }
    case 'SUBMIT_SUCCESS_EDIT':
      return {
        ...state,
        testimonials: state.testimonials.map((testimonial) =>
          testimonial.id === action.testimonial.id ? action.testimonial : testimonial,
        ),
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        submitStatus: 'idle',
      }
    case 'SUBMIT_ERROR':
      return { ...state, submitStatus: 'error' }
    case 'DELETE_SUCCESS':
      return { ...state, testimonials: state.testimonials.filter((testimonial) => testimonial.id !== action.id), deleteError: null }
    case 'DELETE_ERROR':
      return { ...state, deleteError: action.error }
  }
}

const labelStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: '#25282B',
}

const inputStyle: CSSProperties = {
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
}

const textareaStyle: CSSProperties = {
  ...inputStyle,
  height: 'auto',
  padding: '12px',
  resize: 'none',
}

const errorStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '14px',
  color: '#E0654F',
  margin: 0,
}

const primaryButtonStyle: CSSProperties = {
  backgroundColor: '#FDC435',
  borderRadius: '8px',
  padding: '10px 24px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 700,
  fontSize: '16px',
  color: '#25282B',
  border: 'none',
  cursor: 'pointer',
}

const secondaryButtonStyle: CSSProperties = {
  border: '2px solid #25282B',
  borderRadius: '8px',
  padding: '10px 24px',
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 700,
  fontSize: '16px',
  color: '#25282B',
  backgroundColor: 'transparent',
  cursor: 'pointer',
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

function getInitials(author: string): string {
  const parts = author.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() ?? ''
}

function TestimonialAvatar({ testimonial }: { testimonial: Testimonial }) {
  const [imgError, setImgError] = useState(false)

  if (imgError || !testimonial.avatarUrl) {
    return (
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: '48px', height: '48px', backgroundColor: '#F5C518' }}
      >
        <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
          {getInitials(testimonial.author)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={testimonial.avatarUrl}
      alt={testimonial.author}
      onError={() => setImgError(true)}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: '48px', height: '48px' }}
    />
  )
}

export default function AdminTestimonialsPage() {
  const [state, dispatch] = useReducer(adminTestimonialsReducer, initialState)

  useEffect(() => {
    let cancelled = false

    fetchCollection<Testimonial>('testimonials')
      .then((testimonials) => {
        if (!cancelled) dispatch({ type: 'LOAD_SUCCESS', testimonials })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'LOAD_ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const result = testimonialSchema.safeParse(state.formValues)

    if (!result.success) {
      const errors: Partial<Record<TestimonialField, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as TestimonialField
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      dispatch({ type: 'VALIDATION_ERROR', errors })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    const payload: Omit<Testimonial, 'id'> = {
      author: result.data.author,
      role: result.data.role,
      content: result.data.content,
      avatarUrl: result.data.avatarUrl,
    }

    try {
      if (state.formMode === 'edit' && state.editingId) {
        await updateTestimonial(state.editingId, payload)
        dispatch({ type: 'SUBMIT_SUCCESS_EDIT', testimonial: { id: state.editingId, ...payload } })
      } else {
        const id = await createTestimonial(payload)
        dispatch({ type: 'SUBMIT_SUCCESS_CREATE', testimonial: { id, ...payload } })
      }
    } catch {
      dispatch({ type: 'SUBMIT_ERROR' })
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    if (!window.confirm(`Supprimer le témoignage de "${testimonial.author}" ?`)) {
      return
    }

    try {
      await deleteTestimonial(testimonial.id)
      dispatch({ type: 'DELETE_SUCCESS', id: testimonial.id })
    } catch {
      dispatch({ type: 'DELETE_ERROR', error: 'Impossible de supprimer ce témoignage.' })
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '28px', color: '#25282B', margin: 0 }}>
          Gestion des témoignages
        </h1>
        {state.formMode === 'closed' && (
          <button type="button" onClick={() => dispatch({ type: 'OPEN_CREATE' })} style={primaryButtonStyle}>
            Ajouter un témoignage
          </button>
        )}
      </div>

      {state.deleteError && <p style={errorStyle}>{state.deleteError}</p>}

      {state.formMode !== 'closed' && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
          style={{ gap: '16px', maxWidth: '480px', backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '8px', padding: '24px' }}
        >
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#25282B', margin: 0 }}>
            {state.formMode === 'edit' ? 'Modifier le témoignage' : 'Nouveau témoignage'}
          </h2>

          <div className="flex flex-col" style={{ gap: '8px' }}>
            <label style={labelStyle}>Nom</label>
            <input
              type="text"
              value={state.formValues.author}
              onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'author', value: e.target.value })}
              style={inputStyle}
            />
            {state.formErrors.author && <p style={errorStyle}>{state.formErrors.author}</p>}
          </div>

          <div className="flex flex-col" style={{ gap: '8px' }}>
            <label style={labelStyle}>Rôle</label>
            <input
              type="text"
              value={state.formValues.role}
              onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'role', value: e.target.value })}
              style={inputStyle}
            />
            {state.formErrors.role && <p style={errorStyle}>{state.formErrors.role}</p>}
          </div>

          <div className="flex flex-col" style={{ gap: '8px' }}>
            <label style={labelStyle}>Témoignage</label>
            <textarea
              rows={4}
              value={state.formValues.content}
              onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'content', value: e.target.value })}
              style={textareaStyle}
            />
            {state.formErrors.content && <p style={errorStyle}>{state.formErrors.content}</p>}
          </div>

          <div className="flex flex-col" style={{ gap: '8px' }}>
            <label style={labelStyle}>Avatar (URL)</label>
            <input
              type="text"
              value={state.formValues.avatarUrl}
              onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'avatarUrl', value: e.target.value })}
              style={inputStyle}
            />
            {state.formErrors.avatarUrl && <p style={errorStyle}>{state.formErrors.avatarUrl}</p>}
          </div>

          {state.submitStatus === 'error' && (
            <p style={errorStyle}>Une erreur est survenue, veuillez réessayer.</p>
          )}

          <div className="flex" style={{ gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => dispatch({ type: 'CLOSE_FORM' })} style={secondaryButtonStyle}>
              Annuler
            </button>
            <button
              type="submit"
              disabled={state.submitStatus === 'submitting'}
              style={{
                ...primaryButtonStyle,
                cursor: state.submitStatus === 'submitting' ? 'default' : 'pointer',
                opacity: state.submitStatus === 'submitting' ? 0.7 : 1,
              }}
            >
              {state.submitStatus === 'submitting' ? 'Enregistrement...' : state.formMode === 'edit' ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      {state.status === 'loading' && (
        <div className="flex items-center justify-center" style={{ paddingTop: '24px' }}>
          <LoadingSpinner />
        </div>
      )}

      {state.status === 'error' && <p style={errorStyle}>Impossible de charger les témoignages.</p>}

      {state.status === 'success' && state.testimonials.length === 0 && (
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>Aucun témoignage pour le moment.</p>
      )}

      {state.status === 'success' && state.testimonials.length > 0 && (
        <div className="flex flex-col">
          {state.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-center justify-between"
              style={{ padding: '16px 0', borderBottom: '1px solid #E8ECF4', gap: '24px' }}
            >
              <div className="flex items-center" style={{ gap: '16px', minWidth: 0 }}>
                <TestimonialAvatar testimonial={testimonial} />
                <div className="flex flex-col" style={{ gap: '4px', minWidth: 0 }}>
                  <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#25282B' }}>
                    {testimonial.author}
                  </span>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282' }}>{testimonial.role}</span>
                  <p
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '14px',
                      color: '#828282',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {testimonial.content}
                  </p>
                </div>
              </div>
              <div className="flex" style={{ gap: '12px', flexShrink: 0 }}>
                <button type="button" onClick={() => dispatch({ type: 'OPEN_EDIT', testimonial })} style={secondaryButtonStyle}>
                  Modifier
                </button>
                <button type="button" onClick={() => handleDelete(testimonial)} style={dangerButtonStyle}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
