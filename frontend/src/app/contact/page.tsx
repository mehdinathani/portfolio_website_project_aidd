import ContactForm from '@/components/sections/contact-form'

export const metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to work together? Send me a message or book a call.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
        <div className="mt-10">
          <a
            href="https://cal.com/mehdinathani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            Or book a call directly &rarr;
          </a>
        </div>
      </div>
    </main>
  )
}
