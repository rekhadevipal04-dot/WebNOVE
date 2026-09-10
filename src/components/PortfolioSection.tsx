import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  TrendingUp,
  Quote,
  X,
  CheckCircle,
  Eye,
  Layers,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/webnovaData.ts';
import { PortfolioProject } from '../types/index.ts';

interface PortfolioSectionProps {
  onOpenBooking: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenBooking }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const categories = ['All', 'E-Commerce', 'Business', 'Web Apps', 'SEO Growth'];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((proj) => {
    if (activeCategory === 'All') return true;
    return proj.category === activeCategory;
  });

  return (
    <section id="portfolio" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>PROVEN TRACK RECORD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Client Portfolio &amp; Case Studies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Real businesses. Real performance metrics. Explore how our custom engineering and growth systems drive market dominance.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Showcase Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    {project.category}
                  </span>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Case</span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {project.client}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* High-Impact Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono block">
                          {m.value}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block mt-0.5">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Testimonial preview / CTA */}
              <div className="px-6 pb-5 pt-1">
                {project.testimonial ? (
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 italic flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="line-clamp-2">"{project.testimonial.quote}"</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-2 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
                  >
                    <span>Read Full Case Study</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA below portfolio */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading">
              Ready to create your next digital benchmark?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              Let Anand Pal and Suryapartap Pal architect a modern website tailored specifically to your conversion goals.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold tracking-wide uppercase shadow-md transition-colors flex-shrink-0 cursor-pointer"
          >
            Start Your Project Today
          </button>
        </div>
      </div>

      {/* Project Case Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden mb-6 bg-slate-950">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold font-heading mt-1">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-slate-300">{selectedProject.client}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Overview &amp; Execution
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Verified Metrics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verified Performance Impact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedProject.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60"
                    >
                      <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono block">
                        {m.value}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5 block">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {selectedProject.testimonial && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs italic text-slate-700 dark:text-slate-200 leading-relaxed">
                    "{selectedProject.testimonial.quote}"
                  </p>
                  <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                    — {selectedProject.testimonial.author},{' '}
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      {selectedProject.testimonial.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Engineering Stack &amp; Integrations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build A Similar Solution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
