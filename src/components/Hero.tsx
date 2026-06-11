import yellowBg from '../assets/yellow-bg.png'

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section
      id="accueil"
      className="w-full bg-white relative overflow-hidden flex items-center"
      style={{ minHeight: '700px' }}
    >
      {/* Blob jaune (photo de Maël et Marie incluse dans l'image) */}
      <div
        style={{
          position: 'absolute',
          right: '0px',
          top: '-10px',
          width: '830px',
          height: '725px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img
          src={yellowBg}
          alt="Maël Gadou et Marie Tassel"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
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
          Étudiants ingénieurs
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
          Bonjour, nous sommes<br />Maël & Marie
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
          Tous deux étudiants ingénieurs à l'EFREI Bordeaux après un BUT Génie Électrique et
          Informatique Industrielle à l'IUT d'Angers, nous partageons la même curiosité pour
          la technique sous toutes ses formes — électronique, automatisme, développement
          logiciel et data. Ensemble, nous concevons des projets qui allient rigueur
          d'ingénieur et créativité, du circuit imprimé à l'application web.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
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
            aria-label="LinkedIn Maël Gadou"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '2px solid #25282B',
              borderRadius: '8px',
              color: '#25282B',
              textDecoration: 'none',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            <LinkedInIcon />
            <span>Maël</span>
          </a>

          <a
            href="https://www.linkedin.com/in/marie-tassel-8129152bb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Marie Tassel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '2px solid #25282B',
              borderRadius: '8px',
              color: '#25282B',
              textDecoration: 'none',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            <LinkedInIcon />
            <span>Marie</span>
          </a>
        </div>

      </div>
    </section>
  )
}
