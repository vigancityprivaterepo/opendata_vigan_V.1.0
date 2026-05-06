import Link from 'next/link'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 text-gray-600 border-t border-gray-200" role="contentinfo">

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl text-vigan-primary">🏛️</span>
            <div>
              <p className="font-display font-bold text-gray-900 text-lg leading-tight">Vigan City</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">Open Data Portal</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4 text-gray-600">
            Official open data initiative of the City Government of Vigan,
            Ilocos Sur — a UNESCO World Heritage City.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs bg-gray-200 text-gray-600 rounded-md px-2.5 py-1">
            <span>Powered by</span>
            <a href="https://ckan.org" target="_blank" rel="noopener noreferrer"
               className="font-semibold text-gray-800 hover:text-vigan-primary transition-colors">
              CKAN
            </a>
            <ExternalLink size={10} className="text-gray-500" />
          </div>
        </div>

        {/* Col 2 — Explore */}
        <div>
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            Explore Data
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: '/datasets',      label: 'All Datasets' },
              { href: '/organizations', label: 'Agencies' },
              { href: '/api-docs',      label: 'API Documentation' },
              { href: '/api/3/action/package_list', label: 'CKAN API', external: true },
            ].map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-600 hover:text-vigan-primary hover:underline transition-colors flex items-center gap-1 w-fit">
                    {item.label} <ExternalLink size={11} />
                  </a>
                ) : (
                  <Link href={item.href}
                        className="text-sm text-gray-600 hover:text-vigan-primary hover:underline transition-colors block w-fit">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Resources */}
        <div>
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            Resources
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: '/about',          label: 'About the Portal' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms-of-use',   label: 'Terms of Use' },
              { href: '/data-request',   label: 'Request Data' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href}
                      className="text-sm text-gray-600 hover:text-vigan-primary hover:underline transition-colors block w-fit">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h3 className="font-display font-semibold text-gray-900 mb-4">
            Contact Us
          </h3>
          <address className="not-italic space-y-3">
            <div className="flex gap-2.5 text-sm items-start">
              <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-gray-600 leading-relaxed">
                City Hall, Quezon Ave<br/>Vigan City, Ilocos Sur 2700
              </span>
            </div>
            <div className="flex gap-2.5 text-sm items-center">
              <Mail size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
              <a href="mailto:opendata@vigan.gov.ph"
                 className="text-gray-600 hover:text-vigan-primary hover:underline transition-colors">
                opendata@vigan.gov.ph
              </a>
            </div>
            <div className="flex gap-2.5 text-sm items-center">
              <Phone size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-600">(077) 722-2623</span>
            </div>
          </address>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="bg-gray-200 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {year} City Government of Vigan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-800 transition-colors">Privacy Statement</Link>
            <Link href="/terms-of-use" className="hover:text-gray-800 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
