import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Explainer',
  description: 'Paste code → line-by-line explanation + complexity'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
