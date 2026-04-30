import ContactForm from '@/components/sections/contact-form'

export const metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">Get in Touch</h1>
      <p className="mb-10 text-center text-gray-600">
        Have a question or want to work together? Fill out the form below.
      </p>
      <ContactForm />
    </main>
  )
}
