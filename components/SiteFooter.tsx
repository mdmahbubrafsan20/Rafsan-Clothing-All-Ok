"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

const HELP_PHONE = "+880 1XXX-XXXXXX";
const HELP_PHONE_TEL = "+8801XXXXXXXXX";

const iconClass = "h-6 w-6 sm:h-7 sm:w-7";

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg
      className={`${iconClass} ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function SocialFacebook({ className }: { className?: string }) {
  return (
    <svg className={`${iconClass} ${className ?? ""}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SocialYoutube({ className }: { className?: string }) {
  return (
    <svg className={`${iconClass} ${className ?? ""}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SocialTiktok({ className }: { className?: string }) {
  return (
    <svg className={`${iconClass} ${className ?? ""}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.69V2h-3v11.11a2.89 2.89 0 1 1-5.2-1.74 2.9 2.9 0 0 1 2.31-1.66V7.35a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.56a8.16 8.16 0 0 0 4.73 1.55V6.7a4.32 4.32 0 0 1-1-.06z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", Icon: SocialInstagram },
  { label: "Facebook", href: "https://facebook.com", Icon: SocialFacebook },
  { label: "YouTube", href: "https://youtube.com", Icon: SocialYoutube },
  { label: "TikTok", href: "https://tiktok.com", Icon: SocialTiktok },
] as const;

const legalLinks = [
  { label: "About Us", href: "/about" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Return Policy", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
] as const;

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function onSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <footer
      className="w-full bg-[#1a1a1a] text-zinc-100 pb-24 md:pb-10"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 pt-8 pb-6 sm:px-6 md:px-8 md:pt-10">
        {/* For help — Fabrilife-style prominent block */}
        <section className="border-b border-white/10 pb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-3">
            For help
          </h2>
          <a
            href={`tel:${HELP_PHONE_TEL}`}
            className="text-xl font-semibold text-white tracking-wide hover:text-zinc-200"
          >
            {HELP_PHONE}
          </a>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-md">
            Customer service: Sun–Thu, 10am–8pm (excluding public holidays). We typically reply within
            a few hours.
          </p>
        </section>

        {/* Follow us */}
        <section className="border-b border-white/10 py-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">
            Follow us
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white transition-colors"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </section>

        {/* Links grid — mobile stacked */}
        <nav className="border-b border-white/10 py-6" aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-8 md:gap-y-2">
            {legalLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-zinc-300 hover:text-white underline-offset-4 hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter */}
        <section className="border-b border-white/10 py-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-3">
            Get offers & updates
          </h2>
          <form onSubmit={onSubscribe} className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:max-w-lg">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 flex-1 rounded-md border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/30"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-md bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 active:scale-[0.99] transition"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="mt-2 text-xs text-emerald-400" role="status">
              Thanks — you&apos;re on the list.
            </p>
          )}
        </section>

        {/* Payment methods */}
        <section className="pt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-4 text-center md:text-left">
            We accept
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
            <span className="rounded border border-white/15 bg-white/[0.07] px-3 py-2 text-[10px] font-bold tracking-wider text-white sm:text-xs">
              VISA
            </span>
            <span className="rounded border border-white/15 bg-white/[0.07] px-3 py-2 text-[10px] font-bold tracking-wider text-white sm:text-xs">
              MC
            </span>
            <span className="rounded border border-white/15 bg-[#E2136E]/25 px-3 py-2 text-[10px] font-bold text-pink-100 sm:text-xs">
              bKash
            </span>
            <span className="rounded border border-white/15 bg-[#f7941d]/20 px-3 py-2 text-[10px] font-bold text-orange-100 sm:text-xs">
              Nagad
            </span>
            <span className="rounded border border-white/15 bg-[#8B2F9F]/25 px-3 py-2 text-[10px] font-bold text-purple-100 sm:text-xs">
              Rocket
            </span>
          </div>
        </section>

        <p className="mt-8 text-center text-[11px] text-zinc-600 md:text-left">
          © {new Date().getFullYear()} Rafsan Clothing. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
