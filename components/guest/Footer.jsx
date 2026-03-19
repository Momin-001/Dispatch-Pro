import Link from "next/link";
import { Facebook, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact-us", label: "Contact Us" },
];

const FOR_YOU_LINKS = [
  { href: "/drivers", label: "For Drivers" },
  { href: "/owner-operators", label: "For Owner-Operators" },
  { href: "/shippers", label: "For Shippers" },
  { href: "/careers", label: "Careers" },
];

const SOCIAL = [
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", Icon: Twitter },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block text-xl font-bold tracking-tight">
              <span className="text-background">DISPATCH</span>
              <span className="text-secondary">PRO</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/80">
              Connecting trucking professionals with premium loads and providing
              comprehensive dispatch support nationwide.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
                  aria-label={label}
                >
                  <Icon className="size-5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-background">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-background/80 transition-colors hover:text-background"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For You */}
          <div>
            <h3 className="text-base font-bold text-background">For You</h3>
            <ul className="mt-4 space-y-3">
              {FOR_YOU_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-background/80 transition-colors hover:text-background"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold text-background">Contact Info</h3>
            <ul className="mt-4 space-y-4 text-sm text-background/80">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
                <a href="tel:+15551234567" className="hover:text-background">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
                <a href="mailto:info@dispatchpro.com" className="hover:text-background">
                  info@dispatchpro.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
                <span>123 Logistics Ave, Houston, TX 77001</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-background/20" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-background/80">
            © {year} DispatchPro. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-background/80">
            <Link href="/privacy" className="hover:text-background">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-background">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
