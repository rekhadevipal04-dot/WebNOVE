import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  ArrowUp,
  ShieldCheck,
  Code2,
  Heart,
  Lock,
} from 'lucide-react';
import { WebnovaLogo } from './WebnovaLogo.tsx';
import { COMPANY_INFO } from '../data/webnovaData.ts';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenQR: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQR, onOpenAdminLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <WebnovaLogo size="lg" showTagline={true} />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-2">
              Premier web development and digital marketing agency headquartered in Mumbai. We build modern, high-converting digital assets and enterprise software engineered for measurable business growth.
            </p>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Founders &amp; Leadership
                </span>
                <p className="text-white font-semibold">
                  Anand Pal <span className="text-blue-400 font-normal">(Founder &amp; CEO)</span>
                </p>
                <p className="text-white font-semibold">
                  Suryapartap Pal <span className="text-sky-400 font-normal">(Co-Founder &amp; Director)</span>
                </p>
              </div>
            </div>

            <p className="text-xs font-mono text-blue-400 pt-1">
              {COMPANY_INFO.credo}
            </p>
          </div>

          {/* Col 3: Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  E-Commerce Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Business Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Website Maintenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  SEO &amp; Growth Strategy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Performance Paid Ads
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Client Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer-booking')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Industry Insights &amp; Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portal')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Client Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Reach Support Team
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQR}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 text-blue-400"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Scan Digital Card</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Verified Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading mb-4">
              Mumbai Office
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={COMPANY_INFO.telUrl}
                  className="text-white hover:text-blue-400 font-mono transition-colors"
                >
                  {COMPANY_INFO.phoneFormatted}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  WhatsApp Support
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={COMPANY_INFO.mailUrl}
                  className="text-slate-300 hover:text-blue-400 transition-colors"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WEBNOVA. All rights reserved. {COMPANY_INFO.legalName}</p>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 Vault Certified</span>
            </span>

            {onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs"
                title="Agency Management & Admin Login"
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Agency Admin</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
