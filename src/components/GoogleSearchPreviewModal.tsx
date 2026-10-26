import React, { useState } from 'react';
import { X, Search, Globe, CheckCircle2, Smartphone, Monitor, ExternalLink, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { WebnovaLogo } from './WebnovaLogo';

interface GoogleSearchPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSearchPreviewModal: React.FC<GoogleSearchPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('webnova');
  const [activeTab, setActiveTab] = useState<'preview' | 'seo-status'>('preview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-sky-400 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Google Search SERP &amp; Logo Preview</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  deviceView === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                  deviceView === 'mobile'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'preview' ? 'seo-status' : 'preview')}
              className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors"
            >
              {activeTab === 'preview' ? 'View Google SEO Schema' : 'Back to Search View'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/40">
          {activeTab === 'preview' ? (
            <div className="space-y-6">
              {/* Google Simulator Container */}
              <div className="mx-auto max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
                {/* Simulated Google Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  {/* Google Logo */}
                  <div className="font-medium text-2xl tracking-tighter select-none font-sans flex items-center">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>

                  {/* Simulated Search Input */}
                  <div className="relative flex-1 w-full">
                    <div className="flex items-center w-full px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus-within:shadow-md transition-shadow">
                      <Search className="w-4 h-4 text-slate-400 mr-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Google..."
                        className="w-full text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Search Tabs */}
                <div className="flex items-center gap-4 pt-3 pb-4 text-xs font-medium text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400 pb-1 font-semibold flex items-center gap-1">
                    <Search className="w-3 h-3" /> All
                  </span>
                  <span>Images</span>
                  <span>News</span>
                  <span>Maps</span>
                  <span>Videos</span>
                </div>

                {/* Google Result Count & Speed */}
                <div className="text-[11px] text-slate-400 dark:text-slate-500 py-2">
                  About 14,800 results (0.32 seconds)
                </div>

                {/* ========================================================= */}
                {/* Simulated Search Snippet with the Brand Logo */}
                {/* ========================================================= */}
                <div className={`mt-2 ${deviceView === 'mobile' ? 'max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800' : ''}`}>
                  
                  {/* Result Header: Favicon + Breadcrumbs */}
                  <div className="flex items-center gap-3">
                    {/* The Official WEBNOVA Favicon as seen on Google Search */}
                    <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center p-0.5 shadow-xs border border-sky-500/40 flex-shrink-0">
                      <WebnovaLogo size="xs" variant="icon-only" />
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-200">
                        WEBNOVA
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <span>https://www.webnova.in</span>
                        <span>›</span>
                        <span className="text-slate-600 dark:text-slate-300">agency</span>
                      </div>
                    </div>
                  </div>

                  {/* Google Blue Result Title */}
                  <h3 className="mt-2 text-lg sm:text-xl font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                    WEBNOVA - Digital Marketing &amp; Modern Web Agency
                  </h3>

                  {/* Snippet Description */}
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Official platform for <strong className="font-semibold text-slate-900 dark:text-white">WEBNOVA</strong> featuring digital marketing services, custom web design, client portfolio, and an automated customer appointment booking system with database persistence.
                  </p>

                  {/* Rich Google Sitelinks */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">
                        Web Development
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        High-performance modern websites with 99+ PageSpeed score.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">
                        Digital Marketing &amp; SEO
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Strategic growth campaigns, Google search ads, and branding.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">
                        Book Appointment
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Instant consultation schedule with automated confirmation.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline">
                        Client Portfolio
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Real customer case studies and live enterprise projects.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Google Knowledge Panel on Desktop */}
                {deviceView === 'desktop' && (
                  <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <WebnovaLogo size="lg" variant="icon-only" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                              WEBNOVA Agency
                            </h4>
                            <span title="Google Verified Entity">
                              <ShieldCheck className="w-4 h-4 text-blue-500" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Digital Marketing &amp; Web Development Agency • India
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                            <span className="text-slate-400">(84 Google Reviews)</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                        Indexed &amp; Verified
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">SERVICES</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Web, SEO, Marketing</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">HOURS</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Open • Closes 8 PM</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">HEADQUARTERS</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">India</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">APPOINTMENTS</span>
                        <span className="font-medium text-blue-600 dark:text-sky-400">Online 24/7</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Verification Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Google Favicon &amp; Logo
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      192px &amp; 512px compliant icons configured for Googlebot crawlers.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Schema.org JSON-LD
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Organization &amp; WebSite schema with logo image linked for search snippets.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Site Verification Active
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      googleadea069eebe22aba verification tag embedded in HTML head.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* SEO Details & JSON-LD Preview */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Google Search Structured Data (JSON-LD)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  This Schema.org script tells Google Search exactly how to display WEBNOVA, the brand logo, and its services in Google search results.
                </p>

                <pre className="p-3 rounded-lg bg-slate-950 text-sky-300 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.webnova.in/#organization",
      "name": "WEBNOVA",
      "alternateName": "Webnova Digital Agency",
      "url": "https://www.webnova.in/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.webnova.in/icon-512.png",
        "width": 512,
        "height": 512
      },
      "image": "https://www.webnova.in/og-image.png",
      "description": "Official platform for WEBNOVA featuring digital marketing services and modern web design."
    }
  ]
}`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Google Site Verification File
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    File available at: <code className="text-blue-600 dark:text-sky-400">/googleadea069eebe22aba.html</code>
                  </p>
                </div>
                <a
                  href="/googleadea069eebe22aba.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span>Open Verification File</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Preview reflects official Google Search Engine Guidelines for 2026.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
