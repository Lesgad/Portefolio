import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { ContactFormValues } from '../schemas/contact'

export async function submitContactMessage(values: ContactFormValues): Promise<void> {
  await addDoc(collection(db, 'contacts'), {
    ...values,
    createdAt: new Date().toISOString(),
    read: false,
  })
}

export async function markContactMessageAsRead(id: string): Promise<void> {
  await updateDoc(doc(db, 'contacts', id), { read: true })
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, 'contacts', id))
}
