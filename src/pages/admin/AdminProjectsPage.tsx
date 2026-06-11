import { useEffect, useReducer, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import { fetchCollection } from '../../services/firestore'
import { createProject, deleteProject, updateProject } from '../../services/projects'
import { projectSchema, type ProjectFormValues } from '../../schemas/project'
import LoadingSpinner from '../../components/LoadingSpinner'
import type { Project } from '../../types/project'

type ProjectField = keyof ProjectFormValues

interface AdminProjectsState {
  status: 'loading' | 'success' | 'error'
  projects: Project[]
  formMode: 'closed' | 'create' | 'edit'
  editingId: string | null
  formValues: ProjectFormValues
  formErrors: Partial<Record<ProjectField, string>>
  tagInput: string
  submitStatus: 'idle' | 'submitting' | 'error'
  deleteError: string | null
}

type AdminProjectsAction =
  | { type: 'LOAD_SUCCESS'; projects: Project[] }
  | { type: 'LOAD_ERROR' }
  | { type: 'OPEN_CREATE' }
  | { type: 'OPEN_EDIT'; project: Project }
  | { type: 'CLOSE_FORM' }
  | { type: 'FIELD_CHANGE'; field: ProjectField; value: string }
  | { type: 'TAG_INPUT_CHANGE'; value: string }
  | { type: 'ADD_TAG' }
  | { type: 'REMOVE_TAG'; index: number }
  | { type: 'VALIDATION_ERROR'; errors: Partial<Record<ProjectField, string>> }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS_CREATE'; project: Project }
  | { type: 'SUBMIT_SUCCESS_EDIT'; project: Project }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'DELETE_SUCCESS'; id: string }
  | { type: 'DELETE_ERROR'; error: string }

const emptyFormValues: ProjectFormValues = { title: '', description: '', imageUrl: '', tags: [], link: '' }

const initialState: AdminProjectsState = {
  status: 'loading',
  projects: [],
  formMode: 'closed',
  editingId: null,
  formValues: emptyFormValues,
  formErrors: {},
  tagInput: '',
  submitStatus: 'idle',
  deleteError: null,
}

function adminProjectsReducer(state: AdminProjectsState, action: AdminProjectsAction): AdminProjectsState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success', projects: action.projects }
    case 'LOAD_ERROR':
      return { ...state, status: 'error' }
    case 'OPEN_CREATE':
      return {
        ...state,
        formMode: 'create',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        tagInput: '',
        submitStatus: 'idle',
      }
    case 'OPEN_EDIT':
      return {
        ...state,
        formMode: 'edit',
        editingId: action.project.id,
        formValues: {
          title: action.project.title,
          description: action.project.description,
          imageUrl: action.project.imageUrl,
          tags: action.project.tags,
          link: action.project.link ?? '',
        },
        formErrors: {},
        tagInput: '',
        submitStatus: 'idle',
      }
    case 'CLOSE_FORM':
      return {
        ...state,
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        tagInput: '',
        submitStatus: 'idle',
      }
    case 'FIELD_CHANGE': {
      const errors = { ...state.formErrors }
      delete errors[action.field]
      return { ...state, formValues: { ...state.formValues, [action.field]: action.value }, formErrors: errors }
    }
    case 'TAG_INPUT_CHANGE':
      return { ...state, tagInput: action.value }
    case 'ADD_TAG': {
      const tag = state.tagInput.trim()
      if (!tag || state.formValues.tags.includes(tag)) {
        return { ...state, tagInput: '' }
      }
      return { ...state, formValues: { ...state.formValues, tags: [...state.formValues.tags, tag] }, tagInput: '' }
    }
    case 'REMOVE_TAG':
      return { ...state, formValues: { ...state.formValues, tags: state.formValues.tags.filter((_, i) => i !== action.index) } }
    case 'VALIDATION_ERROR':
      return { ...state, formErrors: action.errors }
    case 'SUBMIT_START':
      return { ...state, submitStatus: 'submitting', formErrors: {} }
    case 'SUBMIT_SUCCESS_CREATE':
      return {
        ...state,
        projects: [action.project, ...state.projects],
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        tagInput: '',
        submitStatus: 'idle',
      }
    case 'SUBMIT_SUCCESS_EDIT':
      return {
        ...state,
        projects: state.projects.map((project) => (project.id === action.project.id ? action.project : project)),
        formMode: 'closed',
        editingId: null,
        formValues: emptyFormValues,
        formErrors: {},
        tagInput: '',
        submitStatus: 'idle',
      }
    case 'SUBMIT_ERROR':
      return { ...state, submitStatus: 'error' }
    case 'DELETE_SUCCESS':
      return { ...state, projects: state.projects.filter((project) => project.id !== action.id), deleteError: null }
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

const tagStyle: CSSProperties = {
  fontFamily: 'Nunito, sans-serif',
  fontSize: '12px',
  color: '#25282B',
  backgroundColor: '#F5F6FA',
  borderRadius: '999px',
  padding: '4px 12px',
}

const tagChipStyle: CSSProperties = {
  ...tagStyle,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

const removeTagButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#828282',
  fontSize: '14px',
  lineHeight: 1,
  padding: 0,
}

function ProjectPreviewCard({ formValues }: { formValues: ProjectFormValues }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-white" style={{ border: '1px solid #E8ECF4' }}>
      <div className="w-full relative" style={{ paddingTop: '56.25%' }}>
        {imgError || !formValues.imageUrl ? (
          <div
            className="absolute inset-0 flex items-center justify-center text-center px-4"
            style={{ backgroundColor: '#F5C518' }}
          >
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#FFFFFF' }}>
              {formValues.title || 'Titre du projet'}
            </span>
          </div>
        ) : (
          <img
            src={formValues.imageUrl}
            alt={formValues.title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col" style={{ padding: '16px', gap: '8px' }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#25282B', margin: 0 }}>
          {formValues.title || 'Titre du projet'}
        </h3>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            color: '#828282',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {formValues.description || 'Description du projet...'}
        </p>
        {formValues.tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '8px', marginTop: '4px' }}>
            {formValues.tags.map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminProjectsPage() {
  const [state, dispatch] = useReducer(adminProjectsReducer, initialState)

  useEffect(() => {
    let cancelled = false

    fetchCollection<Project>('projects')
      .then((projects) => {
        if (!cancelled) dispatch({ type: 'LOAD_SUCCESS', projects })
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

    const result = projectSchema.safeParse(state.formValues)

    if (!result.success) {
      const errors: Partial<Record<ProjectField, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ProjectField
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      dispatch({ type: 'VALIDATION_ERROR', errors })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    const payload: Omit<Project, 'id'> = {
      title: result.data.title,
      description: result.data.description,
      imageUrl: result.data.imageUrl,
      link: result.data.link,
      tags: result.data.tags,
    }

    try {
      if (state.formMode === 'edit' && state.editingId) {
        await updateProject(state.editingId, payload)
        dispatch({ type: 'SUBMIT_SUCCESS_EDIT', project: { id: state.editingId, ...payload } })
      } else {
        const id = await createProject(payload)
        dispatch({ type: 'SUBMIT_SUCCESS_CREATE', project: { id, ...payload } })
      }
    } catch {
      dispatch({ type: 'SUBMIT_ERROR' })
    }
  }

  function handleTagInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      dispatch({ type: 'ADD_TAG' })
    }
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Supprimer le projet "${project.title}" ?`)) {
      return
    }

    try {
      await deleteProject(project.id)
      dispatch({ type: 'DELETE_SUCCESS', id: project.id })
    } catch {
      dispatch({ type: 'DELETE_ERROR', error: 'Impossible de supprimer ce projet.' })
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '28px', color: '#25282B', margin: 0 }}>
          Gestion des projets
        </h1>
        {state.formMode === 'closed' && (
          <button type="button" onClick={() => dispatch({ type: 'OPEN_CREATE' })} style={primaryButtonStyle}>
            Ajouter un projet
          </button>
        )}
      </div>

      {state.deleteError && <p style={errorStyle}>{state.deleteError}</p>}

      {state.formMode !== 'closed' && (
        <div className="flex flex-col lg:flex-row" style={{ gap: '24px', alignItems: 'flex-start' }}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            style={{ gap: '16px', maxWidth: '480px', width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '8px', padding: '24px' }}
          >
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#25282B', margin: 0 }}>
              {state.formMode === 'edit' ? 'Modifier le projet' : 'Nouveau projet'}
            </h2>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label style={labelStyle}>Titre</label>
              <input
                type="text"
                value={state.formValues.title}
                onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'title', value: e.target.value })}
                style={inputStyle}
              />
              {state.formErrors.title && <p style={errorStyle}>{state.formErrors.title}</p>}
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                rows={4}
                value={state.formValues.description}
                onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'description', value: e.target.value })}
                style={textareaStyle}
              />
              {state.formErrors.description && <p style={errorStyle}>{state.formErrors.description}</p>}
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label style={labelStyle}>Image (URL)</label>
              <input
                type="text"
                value={state.formValues.imageUrl}
                onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'imageUrl', value: e.target.value })}
                style={inputStyle}
              />
              {state.formErrors.imageUrl && <p style={errorStyle}>{state.formErrors.imageUrl}</p>}
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label style={labelStyle}>Tags</label>
              {state.formValues.tags.length > 0 && (
                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                  {state.formValues.tags.map((tag, index) => (
                    <span key={tag} style={tagChipStyle}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'REMOVE_TAG', index })}
                        aria-label={`Supprimer le tag ${tag}`}
                        style={removeTagButtonStyle}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={state.tagInput}
                onChange={(e) => dispatch({ type: 'TAG_INPUT_CHANGE', value: e.target.value })}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Ajouter un tag (Entrée)"
                style={inputStyle}
              />
              {state.formErrors.tags && <p style={errorStyle}>{state.formErrors.tags}</p>}
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label style={labelStyle}>Lien (URL)</label>
              <input
                type="text"
                value={state.formValues.link}
                onChange={(e) => dispatch({ type: 'FIELD_CHANGE', field: 'link', value: e.target.value })}
                style={inputStyle}
              />
              {state.formErrors.link && <p style={errorStyle}>{state.formErrors.link}</p>}
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

          <div className="flex flex-col" style={{ gap: '16px', width: '100%', maxWidth: '360px' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '20px', color: '#25282B', margin: 0 }}>
              Aperçu
            </h2>
            <ProjectPreviewCard key={state.formValues.imageUrl} formValues={state.formValues} />
          </div>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="flex items-center justify-center" style={{ paddingTop: '24px' }}>
          <LoadingSpinner />
        </div>
      )}

      {state.status === 'error' && <p style={errorStyle}>Impossible de charger les projets.</p>}

      {state.status === 'success' && state.projects.length === 0 && (
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>Aucun projet pour le moment.</p>
      )}

      {state.status === 'success' && state.projects.length > 0 && (
        <div className="flex flex-col">
          {state.projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between"
              style={{ padding: '16px 0', borderBottom: '1px solid #E8ECF4', gap: '24px' }}
            >
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#25282B' }}>
                  {project.title}
                </span>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: '8px' }}>
                    {project.tags.map((tag) => (
                      <span key={tag} style={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282' }}
                  >
                    {project.link}
                  </a>
                )}
              </div>
              <div className="flex" style={{ gap: '12px', flexShrink: 0 }}>
                <button type="button" onClick={() => dispatch({ type: 'OPEN_EDIT', project })} style={secondaryButtonStyle}>
                  Modifier
                </button>
                <button type="button" onClick={() => handleDelete(project)} style={dangerButtonStyle}>
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
