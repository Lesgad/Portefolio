const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/maelgadou/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maël-gadou-489678295/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:mael.gadou@yopmail.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
]

export default function Contact() {
  return (
    <section id="contact" style={{ backgroundColor: '#F5F6FA', paddingTop: '80px', paddingBottom: '48px' }}>

      {/* Titre */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          fontSize: '48px',
          color: '#25282B',
          margin: 0,
        }}>
          Contact
        </h2>
        <div style={{
          width: '48px',
          height: '3px',
          backgroundColor: '#FDC435',
          margin: '12px auto 0',
          borderRadius: '2px',
        }} />
      </div>

      {/* Formulaire */}
      <form style={{ width: '400px', margin: '48px auto 0', display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={(e) => e.preventDefault()}>

        {/* Nom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Nom
          </label>
          <input
            type="text"
            style={{
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
            }}
          />
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Email
          </label>
          <input
            type="email"
            style={{
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
            }}
          />
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: 600, color: '#25282B' }}>
            Message
          </label>
          <textarea
            rows={5}
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #E8ECF4',
              backgroundColor: '#FFFFFF',
              padding: '12px',
              fontFamily: 'Nunito, sans-serif',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

      </form>

      {/* Réseaux + copyright */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '80px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              style={{ color: '#25282B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {social.icon}
            </a>
          ))}
        </div>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#828282', margin: 0 }}>
          Maël Gadou 2026
        </p>
      </div>

    </section>
  )
}
