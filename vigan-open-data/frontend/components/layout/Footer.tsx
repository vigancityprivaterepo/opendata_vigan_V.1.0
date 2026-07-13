import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-vigan-deepDk text-white" role="contentinfo">

      {/* ── Gradient top ribbon ─────────────────────────────────────────────── */}
      <div className="h-1.5 bg-gradient-to-r from-vigan-secondary via-vigan-goldAccent to-vigan-secondary bg-[length:200%_100%]" />

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-14">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Vigan City Seal"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full flex-shrink-0 object-contain ring-2 ring-vigan-border/40"
              />
              <div>
                <p className="font-display font-bold text-white text-lg leading-tight">Vigan City</p>
                <p className="text-vigan-secondary text-xs uppercase tracking-widest font-semibold">Open Data Portal</p>
              </div>
            </div>
            <p className="text-emerald-100/60 text-sm leading-relaxed mb-6">
              Official open data initiative of the City Government of Vigan,
              Ilocos Sur — a UNESCO World Heritage City.
            </p>

            {/* Open Data License badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-emerald-800/60 border border-emerald-700/50
                               text-emerald-300 text-[10px] font-bold uppercase tracking-wider
                               px-3 py-1.5 rounded-full">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden="true">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Open Government Data
              </span>
            </div>

            {/* Powered by CKAN badge */}
            <a
              href="https://ckan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15
                         rounded-lg px-3 py-2 transition-colors"
              aria-label="Powered by CKAN"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                Powered by
              </span>
              <Image
                src="/ckan_logo.svg"
                alt="CKAN"
                width={60}
                height={16}
                className="h-4 w-auto object-contain"
                style={{ width: 'auto' }}
              />
              <ExternalLink size={10} className="text-emerald-400" />
            </a>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Explore Data
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/datasets', label: 'All Datasets' },
                { href: '/organizations', label: 'City Agencies' },
                { href: '/api-docs', label: 'API Documentation' },
                { href: '/api/3/action/package_list', label: 'CKAN API', external: true },
              ].map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-100/60 hover:text-white transition-colors flex items-center gap-1.5 w-fit group"
                    >
                      {item.label}
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-emerald-100/60 hover:text-white transition-colors block w-fit"
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
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About the Portal' },
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-of-use', label: 'Terms of Use' },
                { href: '/data-request', label: 'Request a Dataset' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-emerald-100/60 hover:text-white transition-colors block w-fit"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <address className="not-italic space-y-3.5">
              <div className="flex gap-3 text-sm items-start">
                <MapPin size={15} className="text-vigan-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-emerald-100/60 leading-relaxed">
                  City Hall, Quezon Ave<br />Vigan City, Ilocos Sur 2700
                </span>
              </div>
              <div className="flex gap-3 text-sm items-center">
                <Mail size={15} className="text-vigan-secondary flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:opendata@vigan.gov.ph"
                  className="text-emerald-100/60 hover:text-white transition-colors"
                >
                  opendata@vigan.gov.ph
                </a>
              </div>
              <div className="flex gap-3 text-sm items-center">
                <Phone size={15} className="text-vigan-secondary flex-shrink-0" aria-hidden="true" />
                <span className="text-emerald-100/60">(077) 722-2623</span>
              </div>
            </address>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                aria-label="GitHub"
              >
                <Image
                  src="/github.png"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain brightness-200"
                />
              </a>
              <a
                href="https://vigancity.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                aria-label="Vigan City official website"
              >
                <Image
                  src="/website.png"
                  alt="Vigan City website"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain invert"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="w-full px-12 max-[991px]:px-6 max-[768px]:px-5 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3
                        text-xs text-emerald-100/40">
          <p>© {year} City Government of Vigan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Statement</Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            <span className="text-emerald-100/25 hidden sm:block">Republic of the Philippines</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
