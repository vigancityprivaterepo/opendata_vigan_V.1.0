import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-vigan-primaryDk text-white/80" role="contentinfo">

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🏛️</div>
            <div>
              <p className="font-display font-bold text-white text-lg leading-tight">Vigan City</p>
              <p className="text-vigan-light/70 text-xs uppercase tracking-widest">Open Data Portal</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-3">
            Official open data initiative of the City Government of Vigan,
            Ilocos Sur — a UNESCO World Heritage City since 1999.
          </p>
          <p className="text-xs text-white/40 leading-relaxed mb-4">
            All data published on this portal is official government data.
            Please verify with source agencies where critical.
          </p>
          <div className="inline-flex items-center gap-2 text-xs bg-white/6 border border-white/10 rounded-lg px-3 py-1.5">
            <span className="text-white/50">Powered by</span>
            <a href="https://ckan.org" target="_blank" rel="noopener noreferrer"
               className="font-bold text-vigan-gold hover:text-vigan-goldDk transition-colors">
              CKAN
            </a>
            <ExternalLink size={10} className="text-white/30" />
          </div>
        </div>

        {/* Col 2 — Explore */}
        <div>
          <h3 className="font-display font-bold text-white text-sm mb-4 pb-2 border-b-2 border-vigan-gold inline-block">
            Explore Data
          </h3>
          <ul className="space-y-2">
            {[
              { href: '/datasets',      label: 'All Datasets' },
              { href: '/organizations', label: 'City Departments' },
              { href: '/api-docs',      label: 'API Documentation' },
              { href: '/api/3/action/package_list', label: 'CKAN API', external: true },
            ].map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-white/70 hover:text-vigan-gold transition-colors flex items-center gap-1">
                    {item.label} <ExternalLink size={11} />
                  </a>
                ) : (
                  <Link href={item.href}
                        className="text-sm text-white/70 hover:text-vigan-gold transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Resources */}
        <div>
          <h3 className="font-display font-bold text-white text-sm mb-4 pb-2 border-b-2 border-vigan-gold inline-block">
            Resources
          </h3>
          <ul className="space-y-2">
            {[
              { href: '/about',          label: 'About the Portal' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms-of-use',   label: 'Terms of Use' },
              { href: '/data-request',   label: 'Request a Dataset' },
              { href: '/feedback',       label: 'Send Feedback' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href}
                      className="text-sm text-white/70 hover:text-vigan-gold transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact */}
        <div>
          <h3 className="font-display font-bold text-white text-sm mb-4 pb-2 border-b-2 border-vigan-gold inline-block">
            Contact Us
          </h3>
          <address className="not-italic space-y-3">
            <div className="flex gap-2.5 text-sm">
              <MapPin size={14} className="text-white/40 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-white/70 leading-relaxed">
                City Hall, Quezon Ave, Vigan City, Ilocos Sur 2700
              </span>
            </div>
            <div className="flex gap-2.5 text-sm items-center">
              <Mail size={14} className="text-white/40 flex-shrink-0" aria-hidden="true" />
              <a href="mailto:opendata@vigan.gov.ph"
                 className="text-white/70 hover:text-vigan-gold transition-colors">
                opendata@vigan.gov.ph
              </a>
            </div>
            <div className="flex gap-2.5 text-sm items-center">
              <Phone size={14} className="text-white/40 flex-shrink-0" aria-hidden="true" />
              <span className="text-white/70">(077) 722-2623</span>
            </div>
          </address>

          {/* Social links */}
          <div className="flex gap-2 mt-5">
            <a href="https://www.facebook.com/VIGANCITYgov"
               target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 border border-white/12 text-white/60 hover:bg-vigan-gold hover:text-vigan-primaryDk hover:border-vigan-gold transition-all"
               aria-label="Vigan City on Facebook">
              <Facebook size={16} />
            </a>
            <a href="https://twitter.com/vigancity"
               target="_blank" rel="noopener noreferrer"
               className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 border border-white/12 text-white/60 hover:bg-vigan-gold hover:text-vigan-primaryDk hover:border-vigan-gold transition-all"
               aria-label="Vigan City on Twitter/X">
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="bg-black/15 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {year} City Government of Vigan. All rights reserved.
          </p>
          <nav className="flex items-center gap-3 text-xs" aria-label="Legal links">
            {['Privacy Policy', 'Terms of Use', 'Contact', 'Feedback'].map((label, i) => (
              <span key={label} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/25" aria-hidden="true">·</span>}
                <Link href={`/${label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-white/55 hover:text-vigan-gold transition-colors">
                  {label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-[11px] text-white/35 w-full sm:w-auto">
            This is an official Philippine government website.
          </p>
        </div>
      </div>
    </footer>
  )
}
