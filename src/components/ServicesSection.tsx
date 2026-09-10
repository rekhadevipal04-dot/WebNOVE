import React, { useState } from 'react';
import {
  Code2,
  ShoppingCart,
  TrendingUp,
  Settings,
  Search,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/webnovaData.ts';
import { ServiceItem } from '../types/index.ts';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Settings':
        return <Settings className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Search':
        return <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Target':
        return <Target className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      default:
        return <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'web-dev', label: 'Website Dev' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'business', label: 'Business Sites' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'marketing', label: 'Digital Marketing & SEO' },
  ];

  const filteredServices = SERVICES_DATA.filter((srv) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'marketing') {
      return srv.category === 'marketing' || srv.category === 'seo';
    }
    return srv.category === selectedCategory;
  });

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-100/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE SOLUTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Our Digital Marketing &amp; Engineering Services
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            From high-speed custom websites to omnichannel marketing funnels, we provide the full-stack infrastructure to scale your revenue.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="relative group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {service.popular && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="p-3 w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getServiceIcon(service.icon)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  {service.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {service.tagline}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Features:
                  </span>
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Starting from</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                    {service.startingPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onSelectServiceForBooking(service.title)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                {getServiceIcon(activeModalService.icon)}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  {activeModalService.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {activeModalService.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              {activeModalService.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Scope &amp; Included Features
                </h4>
                <ul className="space-y-2">
                  {activeModalService.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Project Deliverables
                </h4>
                <ul className="space-y-2">
                  {activeModalService.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    Estimated Timeline: {activeModalService.timeline}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Includes dedicated project manager &amp; staging previews
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Estimate</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {activeModalService.startingPrice}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalService(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectServiceForBooking(activeModalService.title);
                  setActiveModalService(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Clock className="w-4 h-4" />
                <span>Book Consultation For This Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
