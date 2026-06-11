import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName))
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as T)
}

export async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const snapshot = await getDoc(doc(db, collectionName, id))
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null
}
