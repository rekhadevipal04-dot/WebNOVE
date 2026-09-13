import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  Building2,
  Clock,
  Zap,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  getFounderPhoto,
  subscribeFounderPhoto,
} from '../services/founderPhoto.ts';
import {
  getSuryaPhoto,
  subscribeSuryaPhoto,
} from '../services/suryaPhoto.ts';
import { ANAND_PAL_PHOTO_DATA_URL } from '../data/anandPalPhoto.ts';
import { SURYA_PAL_PHOTO_DATA_URL } from '../data/suryaPalPhoto.ts';

interface FounderSectionProps {
  onOpenBooking: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

type LeadershipView = 'both' | 'anand' | 'surya';

export const FounderSection: React.FC<FounderSectionProps> = ({
  onOpenBooking,
}) => {
  const [anandPhoto, setAnandPhoto] = useState<string>(() => getFounderPhoto());
  const [suryaPhoto, setSuryaPhoto] = useState<string>(() => getSuryaPhoto());
  const [activeView, setActiveView] = useState<LeadershipView>('both');

  useEffect(() => {
    const unsubAnand = subscribeFounderPhoto((newUrl) => {
      setAnandPhoto(newUrl);
    });
    const unsubSurya = subscribeSuryaPhoto((newUrl) => {
      setSuryaPhoto(newUrl);
    });

    return () => {
      unsubAnand();
      unsubSurya();
    };
  }, []);

  return (
    <section
      id="founder-spotlight"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-white overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      {/* Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-600 dark:text-blue-300 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="uppercase font-mono">Executive Leadership &amp; Co-Founders</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-300 dark:to-teal-300">Founders of WEBNOVA</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Direct executive leadership driving high-speed web architectures, e-commerce engines, and client transformation across India and globally.
          </p>

          {/* Quick Filter Tabs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('both')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'both'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Both Founders</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('anand')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'anand'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>Anand Pal (Founder &amp; CEO)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('surya')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'surya'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25 border border-sky-500'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Surya Pal (Co-Founder &amp; Director)</span>
            </button>
          </div>
        </div>

        {/* Dual Founders Grid */}
        <div
          className={`grid gap-8 items-stretch ${
            activeView === 'both'
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {/* ================= FOUNDER 1: ANAND PAL ================= */}
          {(activeView === 'both' || activeView === 'anand') && (
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-400/30 text-[11px] font-mono font-bold tracking-wider uppercase">
                      FOUNDER &amp; CEO
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Official Leadership</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span>Verified Executive</span>
                  </span>
                </div>

                {/* Portrait and Bio Flex Header */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                  {/* Photo Frame */}
                  <div className="relative w-40 sm:w-44 aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex-shrink-0 group">
                    <img
                      src={anandPhoto || ANAND_PAL_PHOTO_DATA_URL}
                      alt="Anand Pal - Founder & CEO of WEBNOVA"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = ANAND_PAL_PHOTO_DATA_URL;
                      }}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                      <span className="p-1 rounded-md bg-blue-600 text-white" title="Verified Founder">
                        <Award className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Identity Details */}
                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-wide">
                        ANAND PAL
                      </h3>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mt-0.5">
                        FOUNDER &amp; CHIEF EXECUTIVE OFFICER
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>WEBNOVA Agency • Mumbai, India</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-l-2 border-blue-500 border border-slate-200 dark:border-slate-800/80">
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                        &ldquo;At WEBNOVA, our mission is to engineer high-converting, lightning-fast digital solutions. You get measurable growth, pristine code, and direct executive accountability.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-0.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">100+</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Projects Delivered</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">99.8%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Client Satisfaction</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">&lt; 24h</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Response Guarantee</p>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                  Direct Executive Desk:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Meet with Anand</span>
                  </button>
                  <a
                    href="https://wa.me/919519832055?text=Hello%20Anand%20Pal,%20I%20visited%20WEBNOVA%20and%20would%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="mailto:webnova88@gmail.com?subject=Strategic%20Inquiry%20for%20Anand%20Pal%20-%20WEBNOVA"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ================= FOUNDER 2: SURYA PAL ================= */}
          {(activeView === 'both' || activeView === 'surya') && (
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-500" />

              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30 text-[11px] font-mono font-bold tracking-wider uppercase">
                      CO-FOUNDER &amp; DIRECTOR
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Executive Strategy</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                    <span>Verified Executive</span>
                  </span>
                </div>

                {/* Portrait and Bio Flex Header */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                  {/* Photo Frame */}
                  <div className="relative w-40 sm:w-44 aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex-shrink-0 group">
                    <img
                      src={suryaPhoto || SURYA_PAL_PHOTO_DATA_URL}
                      alt="Surya Pal - Co-Founder & Director of WEBNOVA"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = SURYA_PAL_PHOTO_DATA_URL;
                      }}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                      <span className="p-1 rounded-md bg-sky-600 text-white" title="Verified Co-Founder">
                        <Award className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Identity Details */}
                  <div className="space-y-3 text-center sm:text-left flex-1">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-wide">
                        SURYA PAL
                      </h3>
                      <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 tracking-wide uppercase mt-0.5">
                        CO-FOUNDER &amp; EXECUTIVE DIRECTOR
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>WEBNOVA Agency • Mumbai, India</span>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border-l-2 border-sky-400 border border-slate-200 dark:border-slate-800/80">
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                        &ldquo;At WEBNOVA, engineering excellence and client trust are at the heart of everything we build. We architect scalable digital assets that empower businesses to scale relentlessly in the modern digital economy.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400 mb-0.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">85+</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Platforms Built</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">99.9%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Cloud Uptime</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono">24/7</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Support Standard</p>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                  Direct Executive Desk:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Meet with Surya</span>
                  </button>
                  <a
                    href="https://wa.me/919519832055?text=Hello%20Surya%20Pal,%20I%20visited%20WEBNOVA%20and%20would%20like%20to%20discuss%20a%20project%20with%20you."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="mailto:webnova88@gmail.com?subject=Strategic%20Inquiry%20for%20Surya%20Pal%20-%20WEBNOVA"
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
