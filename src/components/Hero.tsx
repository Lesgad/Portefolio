import yellowBg from '../assets/yellow-bg.png'
import photoRbg from '../assets/photo_rbg.png'

export default function Hero() {
  return (
    <section
      id="accueil"
      className="w-full bg-white relative overflow-hidden flex items-center"
      style={{ minHeight: '700px' }}
    >
      {/* Blob jaune + photo contenus dans le même wrapper */}
      <div
        style={{
          position: 'absolute',
          right: '-80px',
          top: '-248px',
          width: '777px',
          height: '877px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img
          src={yellowBg}
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <img
          src={photoRbg}
          alt="Maël Gadou"
          style={{
            position: 'absolute',
            top: '290px',
            left: '45%',
            transform: 'translateX(-50%)',
            width: '310px',
            height: '280px',
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
        />
      </div>

      {/* Contenu texte */}
      <div style={{ paddingLeft: '120px', paddingTop: '110px', paddingBottom: '110px', maxWidth: '606px', position: 'relative', zIndex: 2 }}>

        <span
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            textTransform: 'uppercase',
            color: '#FDC435',
          }}
        >
          Etudiant ingénieur
        </span>

        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '110%',
            color: '#25282B',
            marginTop: '12px',
          }}
        >
          Bonjour, je m'appelle<br />Maël Gadou
        </h1>

        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '150%',
            color: '#828282',
            marginTop: '12px',
            textAlign: 'justify',
          }}
        >
          Ingénieur Big Data & Machine Learning à l'EFREI Bordeaux, je combine
          curiosité technique et créativité pour concevoir des solutions numériques
          performantes — du code embarqué à la data, en passant par le développement web.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <a
            href="#projets"
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
            Projets
          </a>

          <a
            href="https://www.linkedin.com/in/maël-gadou-489678295/"
            target="_blank"
            rel="noopener noreferrer"
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
            LinkedIn
          </a>
        </div>

      </div>
    </section>
  )
}
