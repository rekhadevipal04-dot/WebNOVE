import React, { useState } from 'react';
import { X, MessageCircle, Phone, Mail, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/webnovaData.ts';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `WEBNOVA\nPhone/WhatsApp: ${COMPANY_INFO.phone}\nEmail: ${COMPANY_INFO.email}\nWeb: https://${COMPANY_INFO.website}\nAddress: ${COMPANY_INFO.fullAddress}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Verified Card
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            Let's Connect with WEBNOVA
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scan with your phone camera or click direct actions below
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-5">
          <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
            {/* Crisp SVG QR code linking to wa.me/919519832055 */}
            <svg
              viewBox="0 0 160 160"
              className="w-44 h-44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="160" height="160" fill="white" />
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="40" height="40" rx="4" fill="#0F172A" />
              <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
              <rect x="22" y="22" width="16" height="16" fill="#2563EB" />

              {/* Top-Right Finder */}
              <rect x="110" y="10" width="40" height="40" rx="4" fill="#0F172A" />
              <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
              <rect x="122" y="22" width="16" height="16" fill="#2563EB" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="110" width="40" height="40" rx="4" fill="#0F172A" />
              <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
              <rect x="22" y="122" width="16" height="16" fill="#2563EB" />

              {/* Data modules */}
              <rect x="58" y="14" width="6" height="6" fill="#0F172A" />
              <rect x="70" y="14" width="6" height="6" fill="#0F172A" />
              <rect x="82" y="14" width="6" height="6" fill="#0F172A" />
              <rect x="94" y="14" width="6" height="6" fill="#0F172A" />

              <rect x="58" y="26" width="12" height="6" fill="#2563EB" />
              <rect x="76" y="26" width="6" height="6" fill="#0F172A" />
              <rect x="88" y="26" width="12" height="6" fill="#0F172A" />

              <rect x="58" y="38" width="6" height="6" fill="#0F172A" />
              <rect x="70" y="38" width="12" height="6" fill="#2563EB" />
              <rect x="94" y="38" width="6" height="6" fill="#0F172A" />

              <rect x="14" y="58" width="6" height="6" fill="#0F172A" />
              <rect x="26" y="58" width="12" height="6" fill="#0F172A" />
              <rect x="44" y="58" width="6" height="6" fill="#0F172A" />
              <rect x="58" y="58" width="12" height="6" fill="#0F172A" />
              <rect x="76" y="58" width="6" height="6" fill="#2563EB" />
              <rect x="94" y="58" width="6" height="6" fill="#0F172A" />
              <rect x="110" y="58" width="12" height="6" fill="#0F172A" />
              <rect x="134" y="58" width="12" height="6" fill="#0F172A" />

              <rect x="14" y="70" width="12" height="6" fill="#0F172A" />
              <rect x="38" y="70" width="6" height="6" fill="#0F172A" />
              <rect x="50" y="70" width="6" height="6" fill="#2563EB" />
              <rect x="68" y="70" width="12" height="6" fill="#0F172A" />
              <rect x="88" y="70" width="6" height="6" fill="#0F172A" />
              <rect x="104" y="70" width="12" height="6" fill="#2563EB" />
              <rect x="122" y="70" width="6" height="6" fill="#0F172A" />
              <rect x="138" y="70" width="8" height="6" fill="#0F172A" />

              {/* Center Webnova Icon Accent */}
              <circle cx="80" cy="80" r="14" fill="#0F172A" />
              <circle cx="80" cy="80" r="11" fill="#2563EB" />
              <path d="M 74 76 L 77 84 L 80 78 L 83 84 L 86 76" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

              <rect x="14" y="88" width="6" height="6" fill="#0F172A" />
              <rect x="32" y="88" width="12" height="6" fill="#0F172A" />
              <rect x="58" y="88" width="6" height="6" fill="#0F172A" />
              <rect x="102" y="88" width="12" height="6" fill="#0F172A" />
              <rect x="126" y="88" width="6" height="6" fill="#2563EB" />
              <rect x="138" y="88" width="8" height="6" fill="#0F172A" />

              <rect x="58" y="104" width="6" height="6" fill="#0F172A" />
              <rect x="70" y="104" width="12" height="6" fill="#2563EB" />
              <rect x="94" y="104" width="6" height="6" fill="#0F172A" />
              <rect x="110" y="104" width="6" height="6" fill="#0F172A" />
              <rect x="128" y="104" width="12" height="6" fill="#0F172A" />

              <rect x="58" y="122" width="12" height="6" fill="#0F172A" />
              <rect x="82" y="122" width="6" height="6" fill="#0F172A" />
              <rect x="94" y="122" width="12" height="6" fill="#2563EB" />
              <rect x="118" y="122" width="6" height="6" fill="#0F172A" />
              <rect x="134" y="122" width="12" height="6" fill="#0F172A" />

              <rect x="58" y="138" width="6" height="6" fill="#0F172A" />
              <rect x="74" y="138" width="6" height="6" fill="#0F172A" />
              <rect x="88" y="138" width="12" height="6" fill="#0F172A" />
              <rect x="110" y="138" width="6" height="6" fill="#2563EB" />
              <rect x="126" y="138" width="18" height="6" fill="#0F172A" />
            </svg>
          </div>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            wa.me/91{COMPANY_INFO.phone}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Chat WhatsApp
          </a>

          <a
            href={COMPANY_INFO.telUrl}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            Direct Call
          </a>

          <a
            href={COMPANY_INFO.mailUrl}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email Us
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Details' : 'Copy Card'}
          </button>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {COMPANY_INFO.address}
          </p>
        </div>
      </div>
    </div>
  );
};
