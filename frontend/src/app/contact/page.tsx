import ContactForm from '@/components/sections/contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Mehdi Abbas Nathani — send a message, book a call, or discuss your next project.',
}

export default function ContactPage() {
  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question or want to work together? Send me a message or book a call.
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-xl font-semibold text-foreground">Send a Message</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="mb-6 text-xl font-semibold text-foreground">Book a Call</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="h-[600px] w-full">
                <iframe
                  src="https://cal.com/mehdinathani/30min?embed&month=2026-06&layout=month_view"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Book a call with Mehdi"
                  className="cal-embed"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Prefer a direct link?{' '}
              <a
                href="https://cal.com/mehdinathani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
              >
                Open in new tab &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
