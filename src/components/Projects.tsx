import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import LoadingSpinner from './LoadingSpinner'
import type { Project } from '../types/project'

function ProjectCard({ project, reverse }: { project: Project; reverse: boolean }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} rounded-lg overflow-hidden bg-white`}
      style={{ border: '1px solid #E8ECF4' }}
    >
      {/* Image */}
      <div className="w-full md:w-1/2 relative" style={{ minHeight: '280px' }}>
        {imgError || !project.imageUrl ? (
          <div
            className="absolute inset-0 flex items-center justify-center text-center px-4"
            style={{ backgroundColor: '#F5C518' }}
          >
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '24px', color: '#FFFFFF' }}>
              {project.title}
            </span>
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Texte */}
      <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ padding: '48px', gap: '16px' }}>
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#25282B', margin: 0 }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282', margin: 0 }}>
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '12px',
                  color: '#25282B',
                  backgroundColor: '#F5F6FA',
                  borderRadius: '999px',
                  padding: '4px 12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          to={`/projects/${project.id}`}
          style={{
            display: 'inline-block',
            backgroundColor: '#25282B',
            borderRadius: '8px',
            padding: '10px 24px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#FFFFFF',
            textDecoration: 'none',
            alignSelf: 'flex-start',
            marginTop: '8px',
          }}
        >
          Voir le projet
        </Link>
      </div>
    </div>
  )
}

export default function Projects() {
  const { status, data } = useFirestoreCollection<Project>('projects')

  return (
    <section id="projets" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '48px', color: '#25282B', margin: 0 }}>
          Projets
        </h2>
        <div style={{ width: '48px', height: '3px', backgroundColor: '#FDC435', margin: '12px auto 0', borderRadius: '2px' }} />
      </div>

      {status === 'loading' && (
        <div className="flex items-center justify-center" style={{ paddingTop: '48px' }}>
          <LoadingSpinner />
        </div>
      )}

      {status !== 'loading' && data.length === 0 && (
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282', textAlign: 'center', marginTop: '48px' }}>
          Aucun projet pour le moment.
        </p>
      )}

      {status !== 'loading' && data.length > 0 && (
        <div
          className="flex flex-col"
          style={{
            maxWidth: '1200px',
            margin: '48px auto 0',
            paddingLeft: '24px',
            paddingRight: '24px',
            gap: '24px',
          }}
        >
          {data.map((project, index) => (
            <ProjectCard key={project.id} project={project} reverse={index % 2 === 1} />
          ))}
        </div>
      )}
    </section>
  )
}
