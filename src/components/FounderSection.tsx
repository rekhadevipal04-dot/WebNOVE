import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Building2,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import {
  getFounderPhoto,
  subscribeFounderPhoto,
} from '../services/founderPhoto.ts';
import { ANAND_PAL_PHOTO_DATA_URL } from '../data/anandPalPhoto.ts';

interface FounderSectionProps {
  onOpenBooking: () => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({
  onOpenBooking,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(() => getFounderPhoto());

  useEffect(() => {
    const unsubscribe = subscribeFounderPhoto((newUrl) => {
      setPhotoUrl(newUrl);
    });

    return unsubscribe;
  }, []);

  return (
    <section
      id="founder-spotlight"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden border-t border-slate-800"
    >
      {/* Subtle Background Lighting & Ambient Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase font-mono">Leadership &amp; Executive Direction</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Founder &amp; CEO</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            The visionary driving high-speed web architecture, digital client transformation, and strategic growth at WEBNOVA.
          </p>
        </div>

        {/* Executive Spotlight Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Top Accent Rim */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-teal-400" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Portrait & Live Badges (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-xs sm:max-w-sm">
                {/* Ambient Soft Glow Behind Photo */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-500" />

                {/* Main Photo Container - Clean Executive Frame */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl aspect-[4/5] flex items-center justify-center">
                  <img
                    src={photoUrl || ANAND_PAL_PHOTO_DATA_URL}
                    alt="Anand Pal - Founder & CEO of WEBNOVA"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = ANAND_PAL_PHOTO_DATA_URL;
                    }}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay at Bottom of Photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Status Overlay at Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-slate-200 text-[11px]">Direct Executive Desk</span>
                    </div>

                    <div className="p-2 rounded-xl bg-blue-600/90 text-white backdrop-blur-md shadow-lg" title="Verified Founder">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Subtle Executive Authentication Tag */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-medium text-slate-300">Anand Pal &bull; Founder &amp; CEO</span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Official Verified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Executive Bio, Philosophy & Direct Actions (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Name & Title Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold tracking-wider uppercase">
                    OFFICIAL LEADERSHIP
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>WEBNOVA Agency • Mumbai, India</span>
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide">
                  ANAND PAL
                </h3>
                <p className="text-base sm:text-lg font-semibold text-blue-400 tracking-wide mt-1">
                  FOUNDER &amp; CHIEF EXECUTIVE OFFICER
                </p>
              </div>

              {/* Founder's Mission Statement / Quote */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border-l-4 border-blue-500 border-y border-r border-slate-800 space-y-2">
                <p className="text-sm sm:text-base text-slate-200 italic font-normal leading-relaxed">
                  &ldquo;At WEBNOVA, our mission is to engineer high-converting, lightning-fast digital solutions that turn ambitious businesses into undisputed market leaders. When you partner with us, you don&apos;t get hollow promises—you get measurable growth, pristine code, and direct executive accountability.&rdquo;
                </p>
                <div className="text-xs text-blue-300 font-semibold text-right">
                  — Anand Pal, Founder &amp; CEO
                </div>
              </div>

              {/* Core Execution Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">100+</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Projects Directed &amp; Delivered</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">99.8%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Client Satisfaction Track Record</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-sky-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono">&lt; 24h</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Executive Response Guarantee</p>
                </div>
              </div>

              {/* Direct Leadership Contact Line */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  Direct Executive Desk &amp; Consultations:
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Meeting with Anand</span>
                  </button>

                  <a
                    href="https://wa.me/919519832055?text=Hello%20Anand%20Pal,%20I%20visited%20WEBNOVA%20and%20would%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp (+91 9519832055)</span>
                  </a>

                  <a
                    href="mailto:webnova88@gmail.com?subject=Strategic%20Inquiry%20for%20Anand%20Pal%20-%20WEBNOVA"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>webnova88@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
