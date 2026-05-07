import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ExternalLink, Github, Globe } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-vigan-primaryDk text-white" role="contentinfo">

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Vigan City Seal"
                width={40}
                height={40}
                className="w-10 h-10 rounded flex-shrink-0 object-contain"
              />
              <div>
                <p className="font-bold text-white text-lg leading-tight">Vigan City</p>
                <p className="text-emerald-300 text-xs uppercase tracking-widest font-medium">Open Data Portal</p>
              </div>
            </div>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-5">
              Official open data initiative of the City Government of Vigan,
              Ilocos Sur — a UNESCO World Heritage City.
            </p>
            {/* Powered by CKAN badge */}
            <a
              href="https://ckan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs bg-white/10 border border-white/15 text-emerald-200 hover:bg-white/20 rounded-md px-3 py-1.5 transition-colors"
            >
              <Globe size={12} />
              Powered by CKAN
              <ExternalLink size={10} className="text-emerald-300/60" />
            </a>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-5">
              Explore Data
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/datasets',      label: 'All Datasets' },
                { href: '/organizations', label: 'City Agencies' },
                { href: '/api-docs',      label: 'API Documentation' },
                { href: '/api/3/action/package_list', label: 'CKAN API', external: true },
              ].map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-100/70 hover:text-white transition-colors flex items-center gap-1.5 w-fit group"
                    >
                      {item.label}
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-emerald-100/70 hover:text-white transition-colors block w-fit"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/about',          label: 'About the Portal' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-use',   label: 'Terms of Use' },
                { href: '/data-request',   label: 'Request a Dataset' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-emerald-100/70 hover:text-white transition-colors block w-fit"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3.5">
              <div className="flex gap-3 text-sm items-start">
                <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-emerald-100/70 leading-relaxed">
                  City Hall, Quezon Ave<br />Vigan City, Ilocos Sur 2700
                </span>
              </div>
              <div className="flex gap-3 text-sm items-center">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:opendata@vigan.gov.ph"
                  className="text-emerald-100/70 hover:text-white transition-colors"
                >
                  opendata@vigan.gov.ph
                </a>
              </div>
              <div className="flex gap-3 text-sm items-center">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-emerald-100/70">(077) 722-2623</span>
              </div>
            </address>

            {/* Social links */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 hover:bg-white/20 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href="https://vigan.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300 hover:bg-white/20 hover:text-white transition-all"
                aria-label="Vigan City official website"
              >
                <Globe size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/50">
          <p>© {year} City Government of Vigan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Statement</Link>
            <Link href="/terms-of-use"   className="hover:text-white transition-colors">Terms of Use</Link>
            <span className="text-emerald-100/30 hidden sm:block">Republic of the Philippines</span>
          </div>
        </div>
      </div>

    </footer>
  )
}

