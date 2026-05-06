import type { Metadata } from 'next'
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
  themeColor: '#065F46',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-PH">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
