import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  Globe,
  Sparkles,
  Download,
  MessageCircle,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ConsultationBooking } from '../types/index.ts';
import { COMPANY_INFO } from '../data/webnovaData.ts';
import {
  getCustomerWhatsAppUrl,
  getAgencyWhatsAppUrl,
  buildAppointmentWhatsAppMessage,
} from '../services/whatsappService.ts';

interface BookingSystemProps {
  onBookingSuccess: (booking: ConsultationBooking) => void;
  prefilledService?: string;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  onBookingSuccess,
  prefilledService = '',
}) => {
  const [selectedService, setSelectedService] = useState(
    prefilledService || 'Website Development (Custom & Responsive)'
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-12');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [timezone, setTimezone] = useState<string>('IST (India Standard Time - UTC+5:30)');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    currentWebsite: '',
    budget: '₹25k - ₹50k',
    brief: '',
  });

  const [submittedBooking, setSubmittedBooking] = useState<ConsultationBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableServices = [
    'Website Development (Custom & Responsive)',
    'E-Commerce Store (Online Store & Payments)',
    'Business Website (Professional & SEO Friendly)',
    'Website Maintenance (Fast, Secure & Reliable)',
    'SEO & Organic Search Dominance',
    'Performance Paid Ads (Meta / Google)',
    'Custom Enterprise Web Application',
  ];

  const availableTimeSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:30 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  // Dynamic available upcoming dates
  const upcomingDates = [
    { date: '2026-09-11', day: 'Fri', num: '11' },
    { date: '2026-09-12', day: 'Sat', num: '12' },
    { date: '2026-09-14', day: 'Mon', num: '14' },
    { date: '2026-09-15', day: 'Tue', num: '15' },
    { date: '2026-09-16', day: 'Wed', num: '16' },
    { date: '2026-09-17', day: 'Thu', num: '17' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill out your Name, Email, and Phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const codePart1 = Math.random().toString(36).substring(2, 5);
      const codePart2 = Math.random().toString(36).substring(2, 6);
      const meetingLink = `https://meet.google.com/wnv-${codePart1}-${codePart2}`;

      const newBooking: ConsultationBooking = {
        id: `BOOK-WN-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceType: selectedService,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        timezone: timezone,
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        companyName: formData.company || 'Private Client',
        projectBrief: formData.brief,
        budgetRange: formData.budget,
        meetingLink: meetingLink,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setSubmittedBooking(newBooking);
      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 600);
  };

  const handleDownloadICS = () => {
    if (!submittedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WEBNOVA//Consultation Scheduler//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${submittedBooking.id}@webnova.in
DTSTAMP:20260909T120000Z
DTSTART:20260912T053000Z
DTEND:20260912T061500Z
SUMMARY:WEBNOVA Consultation: ${submittedBooking.serviceType}
DESCRIPTION:WEBNOVA initial consultation with Anand Pal & Suryapartap Pal.\\nMeeting Link: ${submittedBooking.meetingLink}\\nPhone: ${COMPANY_INFO.phone}\\nEmail: ${COMPANY_INFO.email}
LOCATION:${submittedBooking.meetingLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `WEBNOVA-Consultation-${submittedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      currentWebsite: '',
      budget: '₹25k - ₹50k',
      brief: '',
    });
  };

  return (
    <section id="booking" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>AUTOMATED SCHEDULER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Schedule an Initial Consultation
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Select your preferred time slot to meet directly with Founders Anand Pal &amp; Suryapartap Pal. We discuss project feasibility, scope, and technical roadmap.
          </p>
        </div>

        {submittedBooking ? (
          /* Booking Confirmation Card */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-500/40 p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-500 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
              Confirmed • Booking Ref: {submittedBooking.id}
            </span>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading mt-3">
              Consultation Successfully Booked!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
              A calendar invitation and Google Meet link have been automatically generated for{' '}
              <strong className="text-slate-900 dark:text-white">{submittedBooking.clientName}</strong>.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Service:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedBooking.serviceType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Scheduled Date:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedBooking.date} at {submittedBooking.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Timezone:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{submittedBooking.timezone}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Meeting Video Link:</span>
                <a
                  href={submittedBooking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{submittedBooking.meetingLink}</span>
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadICS}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Add to Calendar (.ics)</span>
              </button>

              {/* Send to Client WhatsApp */}
              {submittedBooking.clientPhone && (
                <a
                  href={getCustomerWhatsAppUrl({
                    id: submittedBooking.id,
                    customerName: submittedBooking.clientName,
                    phoneNumber: submittedBooking.clientPhone,
                    email: submittedBooking.clientEmail,
                    service: submittedBooking.serviceType,
                    appointmentDate: submittedBooking.date,
                    appointmentTime: submittedBooking.timeSlot,
                    notes: submittedBooking.projectBrief,
                    status: 'pending',
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Info to My WhatsApp ({submittedBooking.clientPhone})</span>
                </a>
              )}

              {/* Send to WEBNOVA Desk */}
              <a
                href={getAgencyWhatsAppUrl({
                  id: submittedBooking.id,
                  customerName: submittedBooking.clientName,
                  phoneNumber: submittedBooking.clientPhone,
                  email: submittedBooking.clientEmail,
                  service: submittedBooking.serviceType,
                  appointmentDate: submittedBooking.date,
                  appointmentTime: submittedBooking.timeSlot,
                  notes: submittedBooking.projectBrief,
                  status: 'pending',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-emerald-500/40 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Send to WEBNOVA Desk WhatsApp</span>
              </a>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                Book Another Slot
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl"
          >
            {/* Step 1: Select Service */}
            <div className="mb-8">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Select Service Discussion</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {availableServices.map((srv) => (
                  <button
                    type="button"
                    key={srv}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                      selectedService === srv
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/50'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Time Picker */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Select Date &amp; Available Slot</span>
                </label>

                {/* Timezone Switcher */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="bg-transparent border-0 text-xs font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer"
                  >
                    <option value="IST (India Standard Time - UTC+5:30)">IST (UTC+5:30, Mumbai)</option>
                    <option value="GST (Gulf Standard Time - UTC+4:00)">GST (Dubai, UTC+4)</option>
                    <option value="UTC (Coordinated Universal Time)">UTC (London, UTC+0)</option>
                    <option value="EST (Eastern Standard Time - UTC-5:00)">EST (New York, UTC-5)</option>
                  </select>
                </div>
              </div>

              {/* Date Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {upcomingDates.map((item) => (
                  <button
                    type="button"
                    key={item.date}
                    onClick={() => setSelectedDate(item.date)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedDate === item.date
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80 uppercase">{item.day}</span>
                    <span className="text-base font-bold block">{item.num}</span>
                    <span className="text-[10px] block opacity-80">Sep 2026</span>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl text-center text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      selectedTimeSlot === slot
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Client Details */}
            <div className="mb-8">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Contact &amp; Project Info</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 95198 32055"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Company / Brand Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Estimated Budget Bracket
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="₹20k - ₹40k">₹20,000 - ₹40,000 (Standard Website)</option>
                      <option value="₹40k - ₹80k">₹40,000 - ₹80,000 (E-Commerce Store)</option>
                      <option value="₹80k - ₹1.5L">₹80,000 - ₹1,50,000 (Custom Web App)</option>
                      <option value="₹1.5L+">₹1,50,000+ (Enterprise / Scaled Systems)</option>
                      <option value="Maintenance Retainer">Maintenance Retainer (₹5k - ₹15k / mo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                    Current Website URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.currentWebsite}
                      onChange={(e) => setFormData({ ...formData, currentWebsite: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                  Brief Project Requirements &amp; Goals
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Tell us about what you want to build, target audience, preferred launch date..."
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission Banner */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>
                  Zero obligation. 100% confidential. Meeting invite dispatched instantly upon booking.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Video Invite...</span>
                ) : (
                  <>
                    <span>Confirm Initial Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
