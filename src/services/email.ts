import emailjs from '@emailjs/browser'
import type { ContactFormValues } from '../schemas/contact'

export async function sendContactEmail(values: ContactFormValues): Promise<void> {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      from_name: values.name,
      from_email: values.email,
      message: values.message,
    },
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
  )
}
