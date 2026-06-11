import { readFileSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const keyFile = process.argv[2]
if (!keyFile) {
  console.error('Usage: node scripts/update-project-images.mjs <chemin-vers-cle-service-account.json>')
  process.exit(1)
}

const serviceAccount = JSON.parse(readFileSync(keyFile, 'utf-8'))

const app = initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

const images = {
  g0NRRJde0Q3ldnXfeIUe:
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/UNIMATE_PUMA_200_Robot_Arm_%286202074072%29.jpg',
  '1oXCWzLhjKefcbzWqTZP':
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Inside_of_Homemade_2.1_Audio_Power_Amplifier_%286639649273%29.jpg',
  V0jtzHawCe3jxX68s9vN:
    'https://upload.wikimedia.org/wikipedia/commons/5/57/Cabinet_Terminal_Block.jpg',
}

for (const [id, imageUrl] of Object.entries(images)) {
  await db.collection('projects').doc(id).update({ imageUrl })
  console.log(`Mis à jour : ${id} -> ${imageUrl}`)
}

process.exit(0)
