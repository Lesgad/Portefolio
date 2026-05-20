export default function About() {
  return (
    <section id="apropos" className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-[120px] py-[199px_0]" style={{ paddingTop: '199px', paddingBottom: '199px' }}>

        {/* Bloc texte — 588px, gap 32px */}
        <div className="flex flex-col w-[588px]" style={{ gap: '32px' }}>

          {/* Titre */}
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

          {/* Description */}
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
      </div>
    </section>
  )
}
