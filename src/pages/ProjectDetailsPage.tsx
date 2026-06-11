import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFirestoreDoc } from '../hooks/useFirestoreDoc'
import Skeleton from '../components/Skeleton'
import type { Project } from '../types/project'

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { status, data } = useFirestoreDoc<Project>('projects', id)
  const [imgError, setImgError] = useState(false)

  if (status === 'loading') {
    return <Skeleton />
  }

  if (status === 'error' || data === null) {
    return (
      <section className="w-full bg-white flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="flex flex-col items-center text-center" style={{ gap: '16px' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#25282B' }}>
            Projet introuvable
          </h1>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282' }}>
            Ce projet est introuvable.
          </p>
          <Link
            to="/#projets"
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
            Retour aux projets
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-white" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="flex flex-col" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', gap: '24px' }}>
        <div className="w-full relative rounded-lg overflow-hidden" style={{ paddingTop: '50%' }}>
          {imgError || !data.imageUrl ? (
            <div
              className="absolute inset-0 flex items-center justify-center text-center px-4"
              style={{ backgroundColor: '#F5C518' }}
            >
              <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#FFFFFF' }}>
                {data.title}
              </span>
            </div>
          ) : (
            <img
              src={data.imageUrl}
              alt={data.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>

        <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '32px', color: '#25282B', margin: 0 }}>
          {data.title}
        </h1>

        {data.tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {data.tags.map((tag) => (
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

        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#828282', margin: 0 }}>
          {data.description}
        </p>

        <div className="flex" style={{ gap: '12px', flexWrap: 'wrap' }}>
          {data.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
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
              }}
            >
              Voir le projet en ligne
            </a>
          )}
          <Link
            to="/#projets"
            style={{
              display: 'inline-block',
              border: '2px solid #25282B',
              borderRadius: '8px',
              padding: '10px 24px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#25282B',
              textDecoration: 'none',
            }}
          >
            Retour aux projets
          </Link>
        </div>
      </div>
    </section>
  )
}
