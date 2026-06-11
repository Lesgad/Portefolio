import { useState } from 'react'
import photo from '../assets/photo.jpg'
import photo2 from '../assets/photo2.jpg'

interface PersonProps {
  photoSrc: string
  name: string
  role: string
  bio: string
  cv: string
  initials: string
  reverse?: boolean
}

function Person({ photoSrc, name, role, bio, cv, initials, reverse }: PersonProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`flex items-center justify-between ${reverse ? 'flex-row-reverse' : ''}`} style={{ gap: '64px' }}>
      {/* Photo + cercle jaune */}
      <div className="relative flex-shrink-0" style={{ width: '360px', height: '360px' }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#F5C518' }}
        />
        {imgError ? (
          /* Placeholder initiales si la photo n'est pas encore disponible */
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <span
              className="text-white"
              style={{ fontSize: '96px', fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
            >
              {initials}
            </span>
          </div>
        ) : (
          <img
            src={photoSrc}
            alt={name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full rounded-full object-cover object-top"
            style={{ padding: '12px' }}
          />
        )}
      </div>

      {/* Bloc texte */}
      <div className="flex flex-col flex-1" style={{ gap: '16px' }}>
        <div>
          <h3
            className="text-[#25282B]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '40px', margin: 0 }}
          >
            {name}
          </h3>
          <p
            style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '16px', color: '#FDC435', margin: '8px 0 0' }}
          >
            {role}
          </p>
        </div>

        <p
          className="text-[#828282]"
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '150%',
            letterSpacing: '0%',
          }}
        >
          {bio}
        </p>

        <a
          href={cv}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#FDC435',
            borderRadius: '8px',
            padding: '8px 24px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: '#25282B',
            textDecoration: 'none',
            alignSelf: 'flex-start',
          }}
        >
          CV
        </a>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="apropos" className="w-full bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-[120px]" style={{ paddingTop: '120px', paddingBottom: '120px' }}>

        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: '96px' }}>
          <h2
            className="text-[#25282B]"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '48px', margin: 0 }}
          >
            À propos de nous
          </h2>
          <div style={{ width: '48px', height: '3px', backgroundColor: '#FDC435', margin: '12px auto 0', borderRadius: '2px' }} />
        </div>

        {/* Présentations */}
        <div className="flex flex-col" style={{ gap: '120px' }}>
          <Person
            photoSrc={photo}
            name="Maël Gadou"
            role="Ingénieur Big Data & Machine Learning"
            bio="Passionné de robotique et d'automatisme depuis mon BUT Génie Électrique et Informatique Industrielle à l'IUT d'Angers, j'ai rejoint l'EFREI Bordeaux pour me spécialiser en Big Data & Machine Learning. Entre programmation, électronique et cybersécurité, j'aime comprendre comment les systèmes fonctionnent pour mieux les améliorer. En dehors des écrans, on me retrouve aux arts martiaux, au tir sportif ou à bricoler dans mon coin."
            cv="/cv.pdf"
            initials="MG"
          />
          <Person
            photoSrc={photo2}
            name="Marie Tassel"
            role="Ingénieure Logiciel & Systèmes d'Information"
            bio="Curieuse de comprendre le monde qui m'entoure, j'ai suivi un BUT Génie Électrique et Informatique Industrielle, parcours Électronique et Systèmes Embarqués, à l'IUT d'Angers, avant de rejoindre le Cycle Ingénieur Logiciel et Systèmes d'Information de l'EFREI Bordeaux. J'aime autant concevoir une carte électronique que développer et tester des outils logiciels, comme lors de mon alternance chez Diebold Nixdorf. Côté loisirs, je grimpe au mur d'escalade et joue du piano."
            cv="/cv2.pdf"
            initials="MT"
            reverse
          />
        </div>

      </div>
    </section>
  )
}
