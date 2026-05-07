import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Vigan City Open Data Portal',
    template: '%s | Vigan City Open Data Portal',
  },
  description:
    'Official open data portal of the City Government of Vigan, Ilocos Sur, Philippines — a UNESCO World Heritage City. Discover and download government datasets.',
  keywords: ['Vigan', 'open data', 'Ilocos Sur', 'Philippines', 'government data', 'datasets', 'UNESCO'],
  authors: [{ name: 'City Government of Vigan — ICT Office', url: 'https://vigan.gov.ph' }],
  openGraph: {
    type:        'website',
    siteName:    'Vigan City Open Data Portal',
    title:       'Vigan City Open Data Portal',
    description: 'Official open data of the City Government of Vigan, Philippines',
    locale:      'en_PH',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Vigan City Open Data Portal',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#065F46',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-PH">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white antialiased">
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
