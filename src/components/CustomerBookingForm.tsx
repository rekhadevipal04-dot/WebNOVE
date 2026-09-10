import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Briefcase,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Send,
  Copy,
  Check,
} from 'lucide-react';
import { BookingRecord, createBookingInDb } from '../services/bookingDb.ts';
import {
  getCustomerWhatsAppUrl,
  getAgencyWhatsAppUrl,
  buildAppointmentWhatsAppMessage,
} from '../services/whatsappService.ts';
import {
  PRIMARY_ADMIN_EMAIL,
  ADMIN_NAME,
  buildSingleBookingEmail,
  getGmailWebComposeUrl,
  getMailtoUrl,
} from '../services/adminEmailService.ts';

interface CustomerBookingFormProps {
  onBookingSubmitted?: (booking: BookingRecord) => void;
  onNavigateToAdmin?: () => void;
  preselectedService?: string;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const AVAILABLE_SERVICES = [
  'Custom Website Development',
  'E-Commerce Online Store',
  'Business / Corporate Website',
  'Website Maintenance & 24/7 SLA',
  'SEO & Organic Growth Audit',
  'Performance Paid Marketing (Meta & Google)',
  'Technical Architecture Consultation',
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
];

export const CustomerBookingForm: React.FC<CustomerBookingFormProps> = ({
  onBookingSubmitted,
  onNavigateToAdmin,
  preselectedService,
  onShowToast,
}) => {
  // Today's date in YYYY-MM-DD format as min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [service, setService] = useState(preselectedService || AVAILABLE_SERVICES[0]);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [sendToWhatsApp, setSendToWhatsApp] = useState(true);
  const [autoOpenWhatsApp, setAutoOpenWhatsApp] = useState(true);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (bk: BookingRecord) => {
    const emailData = buildSingleBookingEmail(bk);
    navigator.clipboard.writeText(emailData.body);
    setCopiedEmail(true);
    onShowToast('info', 'Admin Report Copied', `Booking alert copied. Ready to send to ${PRIMARY_ADMIN_EMAIL}.`);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleCopyWhatsApp = (bk: BookingRecord) => {
    const text = buildAppointmentWhatsAppMessage(bk, 'customer');
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    onShowToast('info', 'Copied to Clipboard', 'Appointment details copied. You can paste directly into WhatsApp.');
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phoneNumber.trim()) {
      onShowToast('error', 'Missing Information', 'Please provide both customer name and phone number.');
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      onShowToast('error', 'Missing Schedule', 'Please select both an appointment date and time.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBookingInDb({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        appointmentDate,
        appointmentTime,
        service,
        status: 'pending',
        notes: notes.trim(),
      });

      setConfirmedBooking(newBooking);
      if (onBookingSubmitted) {
        onBookingSubmitted(newBooking);
      }

      if (sendToWhatsApp && autoOpenWhatsApp) {
        const waUrl = getCustomerWhatsAppUrl(newBooking);
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // fallback if browser popup interception occurs
        }
        onShowToast(
          'success',
          'Appointment Saved & WhatsApp Dispatched!',
          `Booking saved in database. WhatsApp window opened with complete appointment details.`
        );
      } else {
        onShowToast(
          'success',
          'Appointment Booking Submitted!',
          `Saved to database. You can now send or share the appointment details on WhatsApp.`
        );
      }
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Submission Failed', 'Could not save booking to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setNotes('');
  };

  return (
    <section id="customer-booking" className="py-14 md:py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>CUSTOMER APPOINTMENT BOOKING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Schedule an Appointment
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Book your consultation slot with our web and marketing specialists. Submissions are instantly stored in the database.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation View */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Booking Successfully Submitted!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Saved in database • Booking Ref: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{confirmedBooking.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold uppercase tracking-wider">
                  Status: {confirmedBooking.status}
                </span>
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Customer Name
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {confirmedBooking.customerName}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Phone Number
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                  {confirmedBooking.phoneNumber}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Service Requested
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {confirmedBooking.service}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Appointment Date
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {confirmedBooking.appointmentDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Appointment Time
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {confirmedBooking.appointmentTime}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Email
                </span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {confirmedBooking.email || 'Not provided'}
                </span>
              </div>
            </div>

            {confirmedBooking.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Customer Notes
                </span>
                <p className="text-slate-700 dark:text-slate-300 italic">{confirmedBooking.notes}</p>
              </div>
            )}

            {/* Dedicated WhatsApp Delivery Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50/50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Send Appointment Info on WhatsApp
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wide">
                        Instant Delivery
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Send your appointment details directly to your WhatsApp number or to WEBNOVA's desk.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp(confirmedBooking)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  {copiedWhatsApp ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied Details!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={getCustomerWhatsAppUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send to Client WhatsApp ({confirmedBooking.phoneNumber})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={getAgencyWhatsAppUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/40 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Send to WEBNOVA Desk (+91 95198 32055)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Message Details Preview Dropdown */}
              <details className="text-xs bg-white/70 dark:bg-slate-900/60 rounded-xl p-3 border border-emerald-200/60 dark:border-emerald-800/50">
                <summary className="cursor-pointer text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] hover:underline flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Formatted WhatsApp Message Content</span>
                </summary>
                <pre className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {buildAppointmentWhatsAppMessage(confirmedBooking, 'customer')}
                </pre>
              </details>
            </div>

            {/* Admin Email Notification Dispatch Box (rekhadevipal04@gmail.com) */}
            {(() => {
              const emailData = buildSingleBookingEmail(confirmedBooking);
              const gmailUrl = getGmailWebComposeUrl(emailData.to, emailData.subject, emailData.body);
              const mailtoUrl = getMailtoUrl(emailData.to, emailData.subject, emailData.body);

              return (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200 dark:border-blue-900/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            Notify Official Admin ({ADMIN_NAME})
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                            Official ID: {PRIMARY_ADMIN_EMAIL}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Directly dispatch complete appointment information to administrator Rekha Devi Pal.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyEmail(confirmedBooking)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copied Email Content!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy Admin Alert</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send to Admin via Gmail Web</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    <a
                      href={mailtoUrl}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-500" />
                      <span>Send via Default Email App</span>
                    </a>
                  </div>
                </div>
              );
            })()}

            {/* Next Steps CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Another Appointment</span>
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
                Our agency team will review your appointment and send confirmation to your WhatsApp shortly.
              </p>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Customer Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Customer Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter customer full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 95198 32055"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Service & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Service *</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {AVAILABLE_SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="client@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Appointment Date & Time Selection */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Appointment Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Appointment Time Slot *</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = appointmentTime === slot;
                        return (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setAppointmentTime(slot)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/50'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Additional Notes */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Project Overview / Notes</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any specific requirements or questions for the consultation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* WhatsApp Notification Options */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="send-whatsapp-cb"
                    checked={sendToWhatsApp}
                    onChange={(e) => setSendToWhatsApp(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="send-whatsapp-cb" className="text-xs cursor-pointer flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Send Appointment Details on WhatsApp Number</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Automatically prepares and dispatches complete appointment information (booking ID, chosen slot, consultant agenda) to{' '}
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                        {phoneNumber.trim() || 'your WhatsApp number'}
                      </span>{' '}
                      and WEBNOVA team.
                    </p>
                  </label>
                </div>

                {sendToWhatsApp && (
                  <div className="pl-7 pt-1 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-open-wa"
                      checked={autoOpenWhatsApp}
                      onChange={(e) => setAutoOpenWhatsApp(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="auto-open-wa" className="text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Automatically open WhatsApp chat upon clicking confirm
                    </label>
                  </div>
                )}
              </div>

              {/* Form Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Saving to Database...</span>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4" />
                      <span>Confirm &amp; Save Appointment Booking</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted &amp; Persisted into Secure Database</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
