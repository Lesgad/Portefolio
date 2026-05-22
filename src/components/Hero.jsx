export default function Hero() {
  return (
    <section id="accueil" className="w-full bg-white">
      <div style={{ paddingLeft: '120px', paddingTop: '110px', maxWidth: '606px' }}>

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

      </div>
    </section>
  )
}
