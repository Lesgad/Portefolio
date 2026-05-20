import { useState } from 'react'
import photo from '../assets/photo.jpg'

export default function About() {
  const [imgError, setImgError] = useState(false)

  return (
    <section id="apropos" className="w-full bg-white overflow-hidden">
      <div
        className="max-w-[1440px] mx-auto px-[120px] flex items-center justify-between"
        style={{ paddingTop: '199px', paddingBottom: '199px' }}
      >
        {/* Bloc texte */}
        <div className="flex flex-col w-[588px]" style={{ gap: '32px' }}>

          <h2
            className="text-[#25282B]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '48px',
              lineHeight: '72px',
              letterSpacing: '0%',
            }}
          >
            À propos de moi
          </h2>

          <p
            className="text-[#828282]"
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '150%',
              letterSpacing: '0%',
            }}
          >
            Étudiant en Ingénieur 1 à l'EFREI Bordeaux, je me passionne pour le développement
            et la création d'expériences numériques qui allient esthétique et performance.
            Curieux, rigoureux et toujours en quête d'apprentissage, je transforme chaque
            défi technique en opportunité de progresser.
          </p>

        </div>

        {/* Photo + cercle jaune */}
        <div className="relative flex-shrink-0" style={{ width: '524px', height: '524px' }}>
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: '#F5C518' }}
          />
          {imgError ? (
            /* Placeholder initiales si la photo n'est pas encore disponible */
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <span
                className="text-white"
                style={{ fontSize: '120px', fontFamily: '"Playfair Display", serif', fontWeight: 700 }}
              >
                MG
              </span>
            </div>
          ) : (
            <img
              src={photo}
              alt="Maël Gadou"
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full rounded-full object-cover object-top"
              style={{ padding: '12px' }}
            />
          )}
        </div>

      </div>
    </section>
  )
}
