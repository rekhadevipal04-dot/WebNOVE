import React from 'react';
import {
  Calendar,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Code2,
  ShoppingCart,
  TrendingUp,
  Settings,
  Users,
  QrCode,
  Zap,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/webnovaData.ts';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenQR: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onOpenAdmin,
  onNavigate,
  onOpenQR,
}) => {
  return (
    <section id="hero" className="relative pt-6 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-600/10 via-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>WE BUILD YOUR DIGITAL FUTURE</span>
          </div>

          <button
            onClick={onOpenQR}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Digital Business Card</span>
          </button>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
            Modern Websites.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400">
              Better Business.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            At <span className="font-bold text-slate-900 dark:text-white">WEBNOVA</span>, we design high-converting
            custom websites, robust e-commerce stores, and data-driven digital marketing architectures that turn visitors into loyal customers.
          </p>

          <p className="mt-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            {COMPANY_INFO.credo}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-5 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 active:scale-98 text-white text-sm font-bold shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Admin Dashboard</span>
              </button>
            )}

            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('portfolio')}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              View Client Portfolio
            </button>
          </div>
        </div>

        {/* Official WEBNOVA Brand Showcase Card (Faithful to the user's card) */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white shadow-2xl border border-blue-900/60 overflow-hidden">
            {/* Tech grid aesthetic lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-between gap-6">
              {/* Left Column: Brand & Leadership */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold tracking-wider font-heading">
                      WEB<span className="text-blue-400">NOVA</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono">
                      OFFICIAL AGENCY
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    EST. MUMBAI
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-3">
                    Leadership &amp; Direction
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-blue-300">
                        AP
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">ANAND PAL</h4>
                        <p className="text-[10px] font-semibold text-blue-400 uppercase">FOUNDER &amp; CEO</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/40 flex items-center justify-center font-bold text-xs text-sky-300">
                        SP
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">SURYAPARTAP PAL</h4>
                        <p className="text-[10px] font-semibold text-sky-400 uppercase">CO-FOUNDER &amp; DIRECTOR</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>WE BUILD YOUR <strong className="text-blue-400">DIGITAL FUTURE</strong></span>
                </div>
              </div>

              {/* Right Column: Contact & Core Services */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-2.5">
                    Our Core Pillars
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Code2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">Website Development</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <ShoppingCart className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span className="truncate">E-Commerce Stores</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Business Websites</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Settings className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="truncate">Fast Maintenance</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Call / WhatsApp:</span>
                    <a
                      href={COMPANY_INFO.telUrl}
                      className="font-mono text-white font-bold hover:text-blue-400 transition-colors"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <a
                      href={COMPANY_INFO.mailUrl}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200 font-mono text-[11px]">
                      {COMPANY_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[10px] font-mono tracking-wider text-blue-300 uppercase">
                    YOUR VISION. OUR CODE. YOUR SUCCESS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges & Highlights */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-heading">150+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Websites Launched</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-heading">99.9%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Uptime SLA Support</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-heading">+240%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Average Lead Growth</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-heading">4.9 / 5</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Verified Client Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
