import { useState } from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import LoadingSpinner from './LoadingSpinner'
import type { Testimonial } from '../types/testimonial'

function getInitials(author: string): string {
  const parts = author.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() ?? ''
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col" style={{ padding: '24px', gap: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8ECF4' }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'italic', color: '#25282B', margin: 0 }}>
        "{testimonial.content}"
      </p>
      <div className="flex items-center" style={{ gap: '12px' }}>
        {imgError || !testimonial.avatarUrl ? (
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '48px', height: '48px', backgroundColor: '#F5C518' }}
          >
            <span style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '18px', color: '#FFFFFF' }}>
              {getInitials(testimonial.author)}
            </span>
          </div>
        ) : (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.author}
            onError={() => setImgError(true)}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: '48px', height: '48px' }}
          />
        )}
        <div className="flex flex-col">
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: '#25282B' }}>
            {testimonial.author}
          </span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: '14px', color: '#828282' }}>
            {testimonial.role}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { status, data } = useFirestoreCollection<Testimonial>('testimonials')

  return (
    <section style={{ paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#F5F6FA' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '48px', color: '#25282B', margin: 0 }}>
          Témoignages
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
          Aucun témoignage pour le moment.
        </p>
      )}

      {status !== 'loading' && data.length > 0 && (
        <div
          className="grid"
          style={{
            maxWidth: '1200px',
            margin: '48px auto 0',
            paddingLeft: '24px',
            paddingRight: '24px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {data.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </section>
  )
}
