import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  imageUrl: z.string().url("L'URL de l'image est invalide.").or(z.literal('')),
  tags: z.array(z.string()),
  link: z.string().url('Le lien est invalide.').or(z.literal('')),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
