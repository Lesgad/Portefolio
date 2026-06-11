function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

const people = [
  {
    name: 'Maël Gadou',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/maelgadou/', icon: <InstagramIcon /> },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maël-gadou-489678295/', icon: <LinkedInIcon /> },
      { label: 'Email', href: 'mailto:mael.gadou@yopmail.com', icon: <EmailIcon /> },
    ],
  },
  {
    name: 'Marie Tassel',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marie-tassel-8129152bb', icon: <LinkedInIcon /> },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-10">
      <div className="flex flex-col items-center" style={{ gap: '32px' }}>

        {/* Une colonne par personne */}
        <div className="flex flex-wrap items-start justify-center" style={{ gap: '64px' }}>
          {people.map((person) => (
            <div key={person.name} className="flex flex-col items-center" style={{ gap: '12px' }}>
              <span
                style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: '#25282B' }}
              >
                {person.name}
              </span>
              <div className="flex items-center" style={{ gap: '16px' }}>
                {person.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} ${person.name}`}
                    className="w-10 h-10 flex items-center justify-center text-[#25282B] hover:opacity-60 transition-opacity duration-200"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-[#828282]"
          style={{ fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '100%', letterSpacing: '0%' }}
        >
          Maël Gadou & Marie Tassel — 2026
        </p>

      </div>
    </footer>
  )
}
