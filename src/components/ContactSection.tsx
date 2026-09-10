import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  User,
  ShieldCheck,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/webnovaData.ts';

interface ContactSectionProps {
  onOpenQR: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenQR,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Website Development',
    budget: '₹25,000 - ₹50,000',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      onShowToast('error', 'Incomplete Form', 'Please provide your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onShowToast(
        'success',
        'Message Dispatched to Leadership',
        `Thank you ${formData.name}! Anand Pal & Suryapartap Pal will review your inquiry shortly.`
      );
    }, 700);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Cols: Direct Contact Details & Card representation */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>LET'S CONNECT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
                Start Your Digital Transformation
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Reach out directly to WEBNOVA. Whether you need a brand-new e-commerce store, a responsive corporate redesign, or continuous 24/7 maintenance, our founders and engineers are ready.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* WhatsApp Card */}
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                      Call / WhatsApp Priority
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {COMPANY_INFO.phoneFormatted}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Chat Now →
                </span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={COMPANY_INFO.telUrl}
                className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 hover:border-blue-500 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide block">
                      Direct Voice Desk
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      +91 {COMPANY_INFO.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Dial Call →
                </span>
              </a>

              {/* Email Address */}
              <a
                href={COMPANY_INFO.mailUrl}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                      Email Inquiries
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {COMPANY_INFO.email}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:translate-x-1 transition-transform">
                  Send Email →
                </span>
              </a>

              {/* Physical Office Location */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                    Headquarters
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {COMPANY_INFO.fullAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Digital Card / QR trigger */}
            <div className="pt-2">
              <button
                onClick={onOpenQR}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>View Official QR Visiting Card &amp; VCF</span>
              </button>
            </div>
          </div>

          {/* Right 7 Cols: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mb-1">
                Send a Direct Project Inquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Receive a scoped response &amp; estimated cost projection within 4 business hours.
              </p>

              {isSuccess ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Inquiry Received!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    Thank you! Our engineering desk in Mumbai has logged your requirements. We will contact you at{' '}
                    <strong className="text-slate-900 dark:text-white">{formData.phone}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        service: 'Website Development',
                        budget: '₹25,000 - ₹50,000',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 95198 32055"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Service Required
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Website Development">Website Development (Custom)</option>
                        <option value="E-Commerce Websites">E-Commerce Websites (Online Store)</option>
                        <option value="Business Websites">Business Websites (SEO Friendly)</option>
                        <option value="Website Maintenance">Website Maintenance (24/7 SLA)</option>
                        <option value="SEO & Growth">SEO &amp; Organic Ranking</option>
                        <option value="Performance Ads">Performance Paid Ads (Meta/Google)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Target Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="₹20,000 - ₹40,000">₹20,000 - ₹40,000</option>
                      <option value="₹40,000 - ₹80,000">₹40,000 - ₹80,000</option>
                      <option value="₹80,000 - ₹1.5L">₹80,000 - ₹1,50,000</option>
                      <option value="₹1.5L+">₹1,50,000+ Enterprise Scale</option>
                      <option value="Monthly Retainer">Monthly Maintenance Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Project Details &amp; Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Outline your project scope, reference websites, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry to WEBNOVA</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
