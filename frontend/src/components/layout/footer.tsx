import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-500">
          &copy; {year} Mehdi Abbas Nathani. All rights reserved.
        </p>

        <nav aria-label="Social media" className="flex gap-4">
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            LinkedIn
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </footer>
  )
}
