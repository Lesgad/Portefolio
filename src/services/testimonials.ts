import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Testimonial } from '../types/testimonial'

export async function createTestimonial(data: Omit<Testimonial, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'testimonials'), data)
  return ref.id
}

export async function updateTestimonial(id: string, data: Omit<Testimonial, 'id'>): Promise<void> {
  await updateDoc(doc(db, 'testimonials', id), data)
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', id))
}
