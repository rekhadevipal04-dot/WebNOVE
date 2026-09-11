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
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { BookingRecord, createBookingInDb } from '../services/bookingDb.ts';
import { sendAutomatedAdminNotification, ADMIN_NOTIFICATION_EMAIL } from '../services/automatedAdminEmail.ts';

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
  'Custom Web Application & SaaS',
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

export const CustomerBookingForm: React.FC<CustomerBookingFormProps> = ({
  onBookingSubmitted,
  preselectedService,
  onShowToast,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Default to tomorrow's date
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [appointmentTime, setAppointmentTime] = useState(TIME_SLOTS[0]);
  const [service, setService] = useState(preselectedService || AVAILABLE_SERVICES[0]);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

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
      // Step 1: Save appointment booking in persistent database
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

      // Update UI to confirmed state (Client sees Booking Submitted screen immediately)
      // NO external tab, NO window, NO WhatsApp message is triggered to the client's number
      setConfirmedBooking(newBooking);
      if (onBookingSubmitted) {
        onBookingSubmitted(newBooking);
      }

      // Step 2: Automated silent background notification to admin at webnova88@gmail.com
      // Completely background and silent — never opens any external page, tab, or local mail app
      sendAutomatedAdminNotification(newBooking).catch((err) => {
        console.warn('[AutoAdminEmail] Background notification log:', err);
      });

      onShowToast(
        'success',
        'Booking Submitted Successfully!',
        `Your appointment has been booked. Notification routed to admin at ${ADMIN_NOTIFICATION_EMAIL}.`
      );
    } catch (err) {
      console.error('[Database Error] Failed to save booking:', err);
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
            Book your consultation slot with our web specialists. Submissions are instantly stored and admin is notified automatically.
          </p>
        </div>

        {confirmedBooking ? (
          /* Client Confirmation View: Booking Submitted */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    Booking Submitted Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Booking Reference ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{confirmedBooking.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Status: PENDING CONFIRMATION
                </span>
              </div>
            </div>

            {/* Reassurance Notice Banner */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Aapki Booking Submit Ho Chuki Hai!
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Aapki appointment information database me save ho gayi hai aur automated email notification WEBNOVA Admin desk (<span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{ADMIN_NOTIFICATION_EMAIL}</span>) ko dispatch ho chuka hai. Humari team jald aapse connect karegi.
                </p>
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
                  Email
                </span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {confirmedBooking.email || 'Not provided'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Service Requested
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmedBooking.service}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Appointment Date
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {confirmedBooking.appointmentDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Appointment Time
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {confirmedBooking.appointmentTime}
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

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Another Appointment</span>
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
                WEBNOVA Agency Desk • All bookings recorded securely in database.
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
                    placeholder="Enter full name"
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
                    placeholder="e.g. +91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Email & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Service Required *</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {AVAILABLE_SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Appointment Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Select Date *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Select Time Slot *</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = appointmentTime === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setAppointmentTime(slot)}
                          className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center ${
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

              {/* Form Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Booking...</span>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4" />
                      <span>Confirm &amp; Submit Appointment</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant database storage • Automated notification to admin at {ADMIN_NOTIFICATION_EMAIL}</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
