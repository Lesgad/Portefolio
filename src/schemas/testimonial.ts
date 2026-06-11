import { z } from 'zod'

export const testimonialSchema = z.object({
  author: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  role: z.string().min(2, 'Le rôle doit contenir au moins 2 caractères.'),
  content: z.string().min(10, 'Le témoignage doit contenir au moins 10 caractères.'),
  avatarUrl: z.string().url("L'URL de l'avatar est invalide.").or(z.literal('')),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>
