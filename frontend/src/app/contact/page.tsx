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
          <p className="type-label mb-4 text-accent/80">Say hello</p>
          <h1 className="type-headline text-white">
            Get in Touch
          </h1>
          <p className="type-body mx-auto mt-4 max-w-xl font-light text-white/50">
            Have a question or want to work together? Send me a message or book a call.
          </p>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-xl font-semibold text-white">Send a Message</h2>
            <ContactForm />
          </div>
          <div>
            <h2 className="mb-6 text-xl font-semibold text-white">Book a Call</h2>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
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
            <p className="mt-3 text-center text-xs text-white/40">
              Prefer a direct link?{' '}
              <a
                href="https://cal.com/mehdinathani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
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
