export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="type-caption border-t border-white/[0.06] py-6 text-center text-white/35">
      &copy; {year} Mehdi Nathani. All rights reserved.
    </footer>
  )
}