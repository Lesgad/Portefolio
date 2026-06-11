import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const keyFile = process.argv[2]
if (!keyFile) {
  console.error('Usage: node scripts/seed-projects.mjs <chemin-vers-cle-service-account.json>')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyFile, 'utf-8'))

const app = initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

const projects = [
  {
    title: 'Robot industriel & supervision',
    description:
      "Programmation et mise en service d'un robot industriel : apprentissage par téléopération (Teach), intégration de modules de machine learning pour l'aide à la décision, et développement d'un site web de suivi du projet. Réalisé dans le respect des normes de sécurité en environnement automatisé.",
    imageUrl: '',
    tags: ['Robotique', 'Machine Learning', 'Automatisme', 'Sécurité'],
    link: '',
  },
  {
    title: 'Amplificateur audio & application mobile',
    description:
      "Conception et réalisation d'une carte électronique d'amplification audio (étage de basse), accompagnée du développement d'une application mobile de suivi pour une entreprise partenaire.",
    imageUrl: '',
    tags: ['Électronique', 'Application mobile', 'Conception'],
    link: '',
  },
  {
    title: "Câblage & programmation d'automates",
    description:
      "Conception du schéma électrique, câblage complet d'une machine industrielle et programmation des automates associés, avec mise en place de procédures de test et de mise en service.",
    imageUrl: '',
    tags: ['Automatisme', 'Câblage', 'Programmation API', 'Tests'],
    link: '',
  },
]

for (const project of projects) {
  const ref = await db.collection('projects').add(project)
  console.log(`Créé : ${project.title} (${ref.id})`)
}

process.exit(0)
