import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Download,
  Shield,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  ExternalLink,
  HelpCircle,
  FileText,
  Send,
  Mail,
  Copy,
  Lock,
  UserCheck,
  Globe,
  UploadCloud,
  Camera,
} from 'lucide-react';
import { BookingRecord, updateBookingStatusInDb } from '../services/bookingDb.ts';
import { getAdminUpdateWhatsAppUrl } from '../services/whatsappService.ts';
import {
  getFounderPhoto,
  saveFounderPhoto,
  subscribeFounderPhoto,
} from '../services/founderPhoto.ts';
import {
  getSuryaPhoto,
  saveSuryaPhoto,
  subscribeSuryaPhoto,
} from '../services/suryaPhoto.ts';
import { ANAND_PAL_PHOTO_DATA_URL } from '../data/anandPalPhoto.ts';
import { SURYA_PAL_PHOTO_DATA_URL } from '../data/suryaPalPhoto.ts';
import {
  ChatInquiry,
  getStoredChatInquiries,
  updateChatInquiryStatus,
  deleteChatInquiry,
  getDirectWhatsAppChatUrl,
  WHATSAPP_DESK_DISPLAY,
  WHATSAPP_DESK_NUMBER,
  formatPhoneForWhatsApp,
} from '../services/supportChatService.ts';
import {
  PRIMARY_ADMIN_EMAIL,
  SECONDARY_ADMIN_EMAIL,
  ADMIN_NAME,
  ADMIN_ROLE,
  buildSingleBookingEmail,
  buildFullDashboardReportEmail,
  getMailtoUrl,
  getGmailWebComposeUrl,
} from '../services/adminEmailService.ts';

interface AdminDashboardProps {
  bookings: BookingRecord[];
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  onRefresh?: () => void;
  onLogout?: () => void;
}

const COMMON_REJECTION_REASONS = [
  'Requested time slot is fully booked / unavailable',
  'Consultant specialist is unavailable at requested time',
  'Please re-schedule for an alternate weekday slot',
  'Service scope outside current operational capacity',
  'Incomplete contact or requirement details provided',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onShowToast,
  onRefresh,
  onLogout,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State for Rejection Reason
  const [rejectingBooking, setRejectingBooking] = useState<BookingRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState(COMMON_REJECTION_REASONS[0]);
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [notifyCustomerOnWhatsApp, setNotifyCustomerOnWhatsApp] = useState(true);

  // Modal State for Acceptance Confirmation
  const [acceptingBooking, setAcceptingBooking] = useState<BookingRecord | null>(null);
  const [notifyAcceptOnWhatsApp, setNotifyAcceptOnWhatsApp] = useState(true);

  // Admin Email Dispatch & Identity State (Official Agency Desk - webnova88@gmail.com)
  const [showEmailReportModal, setShowEmailReportModal] = useState(false);
  const [showNetlifyModal, setShowNetlifyModal] = useState(false);
  const [selectedEmailBooking, setSelectedEmailBooking] = useState<BookingRecord | null>(null);
  const [copiedDashboardReport, setCopiedDashboardReport] = useState(false);
  const [copiedSingleReport, setCopiedSingleReport] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(true);

  // Founder & Leadership Portrait State (Permanent)
  const [founderPhoto, setFounderPhoto] = useState<string>(() => getFounderPhoto());
  const [suryaPhoto, setSuryaPhoto] = useState<string>(() => getSuryaPhoto());

  React.useEffect(() => {
    const unsubFounder = subscribeFounderPhoto((newUrl) => {
      setFounderPhoto(newUrl);
    });

    const unsubSurya = subscribeSuryaPhoto((newUrl) => {
      setSuryaPhoto(newUrl);
    });

    return () => {
      unsubFounder();
      unsubSurya();
    };
  }, []);

  // Live Chat & WhatsApp Inquiries State
  const [activeAdminView, setActiveAdminView] = useState<'bookings' | 'chat_desk'>('bookings');
  const [chatInquiries, setChatInquiries] = useState<ChatInquiry[]>(() => getStoredChatInquiries());
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatStatusFilter, setChatStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');

  React.useEffect(() => {
    const handleUpdate = () => {
      setChatInquiries(getStoredChatInquiries());
    };
    window.addEventListener('webnova_new_chat_inquiry', handleUpdate);
    window.addEventListener('webnova_chat_inquiries_updated', handleUpdate);
    return () => {
      window.removeEventListener('webnova_new_chat_inquiry', handleUpdate);
      window.removeEventListener('webnova_chat_inquiries_updated', handleUpdate);
    };
  }, []);

  const handleUpdateChatStatus = (id: string, newStatus: 'new' | 'reviewed' | 'resolved') => {
    updateChatInquiryStatus(id, newStatus);
    setChatInquiries(getStoredChatInquiries());
    onShowToast('success', 'Inquiry Status Updated', `Status changed to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteChatInquiry = (id: string) => {
    deleteChatInquiry(id);
    setChatInquiries(getStoredChatInquiries());
    onShowToast('info', 'Inquiry Removed', 'The chat record has been removed.');
  };

  // Filtered Chat Inquiries
  const filteredChatInquiries = chatInquiries.filter((inq) => {
    if (chatStatusFilter !== 'all' && inq.status !== chatStatusFilter) {
      return false;
    }
    if (chatSearchQuery.trim()) {
      const q = chatSearchQuery.toLowerCase();
      const matchMsg = inq.message.toLowerCase().includes(q);
      const matchName = (inq.clientName || '').toLowerCase().includes(q);
      const matchPhone = (inq.clientPhone || '').toLowerCase().includes(q);
      const matchId = inq.id.toLowerCase().includes(q);
      return matchMsg || matchName || matchPhone || matchId;
    }
    return true;
  });

  const handleCopyDashboardReport = () => {
    const report = buildFullDashboardReportEmail(bookings);
    navigator.clipboard.writeText(report.body);
    setCopiedDashboardReport(true);
    onShowToast('info', 'Dashboard Report Copied', `Summary copied. Pre-formatted for ${PRIMARY_ADMIN_EMAIL}.`);
    setTimeout(() => setCopiedDashboardReport(false), 3000);
  };

  const handleCopySingleBookingReport = (booking: BookingRecord) => {
    const emailData = buildSingleBookingEmail(booking);
    navigator.clipboard.writeText(emailData.body);
    setCopiedSingleReport(true);
    onShowToast('info', 'Booking Alert Copied', `Appointment details copied for ${PRIMARY_ADMIN_EMAIL}.`);
    setTimeout(() => setCopiedSingleReport(false), 3000);
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) {
      return false;
    }
    // Date filter
    if (dateFilter && b.appointmentDate !== dateFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.phoneNumber.toLowerCase().includes(q);
      const matchService = b.service.toLowerCase().includes(q);
      return matchName || matchPhone || matchService;
    }
    return true;
  });

  // KPI calculations
  const totalCount = bookings.length;
  const totalBookings = totalCount;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  // Execute Accept (Confirm) action
  const handleConfirmAccept = async (booking: BookingRecord, openWhatsApp: boolean = false) => {
    setUpdatingId(booking.id);
    setAcceptingBooking(null);
    try {
      await updateBookingStatusInDb(booking.id, 'confirmed');
      onShowToast(
        'success',
        'Booking Accepted & Confirmed',
        `Appointment for ${booking.customerName} on ${booking.appointmentDate} at ${booking.appointmentTime} is now ACCEPTED.`
      );

      if (openWhatsApp) {
        const waUrl = getAdminUpdateWhatsAppUrl(booking, 'confirmed');
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Update Failed', 'Could not update status in database.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Execute Reject (Cancel) action with reason
  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;
    const booking = rejectingBooking;
    const finalReason = customRejectionReason.trim() || rejectionReason;

    setUpdatingId(booking.id);
    setRejectingBooking(null);
    try {
      await updateBookingStatusInDb(booking.id, 'cancelled', finalReason);
      onShowToast(
        'info',
        'Booking Rejected',
        `Appointment for ${booking.customerName} has been REJECTED. Reason: ${finalReason}`
      );

      if (notifyCustomerOnWhatsApp) {
        const waUrl = getAdminUpdateWhatsAppUrl(booking, 'cancelled', finalReason);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Rejection Failed', 'Could not update status in database.');
    } finally {
      setUpdatingId(null);
      setCustomRejectionReason('');
    }
  };

  // Reset status to pending
  const handleResetToPending = async (booking: BookingRecord) => {
    setUpdatingId(booking.id);
    try {
      await updateBookingStatusInDb(booking.id, 'pending');
      onShowToast('info', 'Reset to Pending', `Booking for ${booking.customerName} is now pending review.`);
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Update Failed', 'Could not reset status in database.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Customer Name',
      'Phone Number',
      'Appointment Date',
      'Appointment Time',
      'Service',
      'Status',
      'Rejection Reason',
      'Email',
      'Notes',
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      `"${b.customerName}"`,
      `"${b.phoneNumber}"`,
      b.appointmentDate,
      b.appointmentTime,
      `"${b.service}"`,
      b.status,
      `"${b.rejectionReason?.replace(/"/g, '""') || ''}"`,
      `"${b.email || ''}"`,
      `"${b.notes?.replace(/"/g, '""') || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `webnova-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('info', 'Export Complete', 'Bookings CSV downloaded successfully.');
  };

  return (
    <section id="admin-dashboard" className="py-14 md:py-20 bg-slate-100/60 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>ADMINISTRATIVE PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
              Appointment Management Dashboard
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Review incoming bookings, verify details, and choose to <strong>Accept</strong> or <strong>Reject</strong> appointments with direct WhatsApp client notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Connected</span>
            </span>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Refresh Bookings"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowEmailReportModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Send full appointment dashboard report to webnova88@gmail.com"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Info to Admin</span>
            </button>

            <button
              onClick={() => setShowNetlifyModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Deploy & update live site on Netlify"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Netlify Deploy</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Lock and hide administrative dashboard"
              >
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>Exit Admin Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Official Super Administrator Identity & Email Dispatch Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {ADMIN_NAME}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>Authorized Super Admin</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                  Active Admin ID
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {PRIMARY_ADMIN_EMAIL}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Appointments & Dashboard updates routed to this email
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowEmailReportModal(true)}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Full Dashboard Info to Admin</span>
            </button>
          </div>
        </div>

        {/* Founders Executive Identity & Photo Management Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Founders &amp; Executive Leadership Media Desk</span>
            </span>
            <a
              href="#founder-spotlight"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <span>View Public Section</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Anand Pal (Founder & CEO) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border-2 border-blue-500/60 shadow-md flex-shrink-0">
                  <img
                    src={founderPhoto}
                    alt="Anand Pal - Founder & CEO"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-extrabold text-white tracking-wide">ANAND PAL</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold uppercase">
                      CEO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Founder &amp; Chief Executive Officer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official Profile Active</span>
                </span>
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer transition shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const url = reader.result as string;
                          saveFounderPhoto(url);
                          onShowToast?.('success', 'Photo Updated', 'Anand Pal photo updated & saved to build.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Surya Pal (Co-Founder & Director) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border-2 border-sky-500/60 shadow-md flex-shrink-0">
                  <img
                    src={suryaPhoto || SURYA_PAL_PHOTO_DATA_URL}
                    alt="Surya Pal - Co-Founder & Director"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== SURYA_PAL_PHOTO_DATA_URL) {
                        target.src = SURYA_PAL_PHOTO_DATA_URL;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-extrabold text-white tracking-wide">SURYA PAL</span>
                    <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[9px] font-bold uppercase">
                      CO-FOUNDER
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Co-Founder &amp; Executive Director
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official Profile Active</span>
                </span>
                <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer transition shadow">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const url = reader.result as string;
                          saveSuryaPhoto(url);
                          onShowToast?.('success', 'Photo Updated', 'Surya Pal photo updated & saved to build.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Operations Switcher: Bookings vs Live Support Chat Desk */}
        <div className="mb-6 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveAdminView('bookings')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeAdminView === 'bookings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointment Bookings ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveAdminView('chat_desk')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeAdminView === 'chat_desk'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Support Desk &amp; WhatsApp Inquiries ({chatInquiries.length})</span>
              {chatInquiries.some((c) => c.status === 'new') && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct WhatsApp Desk: <strong className="text-emerald-600 dark:text-emerald-400">{WHATSAPP_DESK_DISPLAY}</strong></span>
          </div>
        </div>

        {activeAdminView === 'chat_desk' ? (
          /* ========================================================= */
          /* LIVE CHAT & WHATSAPP DESK VIEW */
          /* ========================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Chat Desk Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 text-white border border-emerald-800/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-white">
                      Support Desk Live Chat Inquiries
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>WhatsApp Direct Forwarding Active</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Every message from the website support chat is logged here and forwarded to WhatsApp (<strong>{WHATSAPP_DESK_DISPLAY}</strong>) &amp; <strong>{PRIMARY_ADMIN_EMAIL}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href={`https://api.whatsapp.com/send?phone=${WHATSAPP_DESK_NUMBER}&text=${encodeURIComponent('Hello Anand Pal, checking WEBNOVA live support desk.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Desk ({WHATSAPP_DESK_DISPLAY})</span>
                </a>
              </div>
            </div>

            {/* Chat Filters & Search */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {(
                  [
                    { id: 'all', label: 'All Inquiries', count: chatInquiries.length },
                    { id: 'new', label: 'New / Unread', count: chatInquiries.filter((c) => c.status === 'new').length },
                    { id: 'reviewed', label: 'In Progress', count: chatInquiries.filter((c) => c.status === 'reviewed').length },
                    { id: 'resolved', label: 'Resolved', count: chatInquiries.filter((c) => c.status === 'resolved').length },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setChatStatusFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      chatStatusFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/20 font-bold">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search chat message, client phone..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Inquiries List */}
            {filteredChatInquiries.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {chatInquiries.length === 0 ? 'No Chat Inquiries Yet' : 'No matching inquiries found'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  When a client types questions in the WEBNOVA Support Desk chat widget on the website, every message will immediately be synchronized here and sent to your WhatsApp number ({WHATSAPP_DESK_DISPLAY}).
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredChatInquiries.map((inq) => {
                  const directWhatsAppUrl = getDirectWhatsAppChatUrl(inq.message, inq.clientName, inq.clientPhone);
                  const clientPhoneUrl = inq.clientPhone
                    ? `https://api.whatsapp.com/send?phone=${formatPhoneForWhatsApp(inq.clientPhone)}&text=${encodeURIComponent(`Hello ${inq.clientName || 'there'}, regarding your inquiry at WEBNOVA: "${inq.message}"`)}`
                    : null;

                  return (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                            {inq.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              inq.status === 'new'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                                : inq.status === 'reviewed'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                            }`}
                          >
                            {inq.status === 'new' ? 'New Inquiry' : inq.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {inq.timestamp}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Forwarded to WhatsApp</span>
                          </span>
                        </div>

                        {/* Speech Bubble */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100">
                          <p className="whitespace-pre-line font-medium leading-relaxed">
                            "{inq.message}"
                          </p>
                        </div>

                        {/* Client Details Row */}
                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 flex-wrap pt-1">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold">{inq.clientName || 'Website Live Visitor'}</span>
                          </div>

                          {inq.clientPhone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {inq.clientPhone}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              (No phone entered by client)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap md:flex-col items-stretch gap-2 w-full md:w-56 flex-shrink-0">
                        {/* Send on WhatsApp Desk */}
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Open in WhatsApp Desk</span>
                        </a>

                        {/* WhatsApp to Client directly if phone entered */}
                        {clientPhoneUrl && (
                          <a
                            href={clientPhoneUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>WhatsApp Client Directly</span>
                          </a>
                        )}

                        <div className="flex items-center gap-2">
                          {inq.status !== 'resolved' ? (
                            <button
                              onClick={() => handleUpdateChatStatus(inq.id, 'resolved')}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Mark Resolved</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateChatStatus(inq.id, 'new')}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reopen</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteChatInquiry(inq.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* APPOINTMENT BOOKINGS VIEW (ORIGINAL TABLE & FILTERS) */
          /* ========================================================= */
          <>
        {/* Action Alert Banner for Pending Requests */}
        {pendingCount > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {pendingCount} Incoming Booking{pendingCount > 1 ? 's' : ''} Awaiting Admin Decision
                </h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  New appointment requests are waiting for you to <strong>Accept</strong> or <strong>Reject</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('pending')}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Review {pendingCount} Pending Request{pendingCount > 1 ? 's' : ''}</span>
            </button>
          </div>
        )}

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'all'
                ? 'border-blue-600 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Bookings
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {totalCount}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              All appointments received
            </span>
          </div>

          {/* Pending Review */}
          <div
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'pending'
                ? 'border-amber-500 ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Pending Decisions
              </span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">
              {pendingCount}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
              Needs Accept or Reject
            </span>
          </div>

          {/* Confirmed / Accepted */}
          <div
            onClick={() => setStatusFilter('confirmed')}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'confirmed'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Accepted Bookings
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {confirmedCount}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Approved & confirmed
            </span>
          </div>

          {/* Cancelled / Rejected */}
          <div
            onClick={() => setStatusFilter('cancelled')}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs ${
              statusFilter === 'cancelled'
                ? 'border-red-500 ring-2 ring-red-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
              Rejected Bookings
            </span>
            <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 font-mono mt-1">
              {cancelledCount}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Declined with reason
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All Bookings', count: totalCount },
                { id: 'pending', label: 'Pending Action', count: pendingCount },
                { id: 'confirmed', label: 'Accepted', count: confirmedCount },
                { id: 'cancelled', label: 'Rejected', count: cancelledCount },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? tab.id === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : tab.id === 'confirmed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : tab.id === 'cancelled'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/20 font-bold">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Date Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, phone, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              title="Filter by appointment date"
            />

            {(searchQuery || dateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Clear filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bookings Table (Desktop & Tablet) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Status & Notes</th>
                  <th className="py-3.5 px-4 text-right">Accept / Reject Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {bookings.length === 0
                          ? 'No customer bookings in database yet.'
                          : 'No bookings match your filter criteria.'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {bookings.length === 0
                          ? 'New bookings submitted from the Customer Booking Form will instantly appear in real time here.'
                          : 'Try resetting the status filter or search query.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const isUpdating = updatingId === booking.id;
                    const isPending = booking.status === 'pending';
                    const isConfirmed = booking.status === 'confirmed';
                    const isCancelled = booking.status === 'cancelled';

                    return (
                      <tr
                        key={booking.id}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                          isPending ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {/* 1. Customer Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                isConfirmed
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                  : isCancelled
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              }`}
                            >
                              {booking.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {booking.customerName}
                                </span>
                                {isPending && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                                    NEW
                                  </span>
                                )}
                              </div>
                              {booking.email && (
                                <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                                  {booking.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Phone Number */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {booking.phoneNumber}
                            </span>
                            <a
                              href={`tel:${booking.phoneNumber.replace(/\s+/g, '')}`}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                              title="Direct call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={getAdminUpdateWhatsAppUrl(
                                booking,
                                isConfirmed ? 'confirmed' : isCancelled ? 'cancelled' : 'general',
                                booking.rejectionReason
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                              title="Send appointment info on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        {/* 3. Date & Time */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{booking.appointmentDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{booking.appointmentTime}</span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Service */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-[11px] inline-block max-w-xs truncate">
                            {booking.service}
                          </span>
                        </td>

                        {/* 5. Status & Notes */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 w-fit ${
                                isConfirmed
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                  : isCancelled
                                  ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 animate-pulse'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isConfirmed
                                    ? 'bg-emerald-500'
                                    : isCancelled
                                    ? 'bg-red-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              <span>
                                {isConfirmed
                                  ? 'ACCEPTED'
                                  : isCancelled
                                  ? 'REJECTED'
                                  : 'PENDING ACTION'}
                              </span>
                            </span>

                            {/* Show rejection reason if cancelled */}
                            {isCancelled && booking.rejectionReason && (
                              <div className="text-[10px] text-red-600 dark:text-red-400 bg-red-50/60 dark:bg-red-950/40 p-1.5 rounded border border-red-200 dark:border-red-900 max-w-xs">
                                <strong>Reason:</strong> {booking.rejectionReason}
                              </div>
                            )}

                            {/* Show brief notes if available */}
                            {booking.notes && (
                              <span className="text-[10px] text-slate-400 italic max-w-xs truncate" title={booking.notes}>
                                Note: {booking.notes}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Admin Actions: ACCEPT OR REJECT */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* ACCEPT BUTTON */}
                            <button
                              onClick={() => setAcceptingBooking(booking)}
                              disabled={isUpdating || isConfirmed}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isConfirmed
                                  ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 border border-emerald-300 dark:border-emerald-800 cursor-not-allowed opacity-75'
                                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm'
                              }`}
                              title={isConfirmed ? 'Already accepted' : 'Accept this booking appointment'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isConfirmed ? 'Accepted' : 'Accept'}</span>
                            </button>

                            {/* REJECT BUTTON */}
                            <button
                              onClick={() => {
                                setRejectingBooking(booking);
                                setRejectionReason(COMMON_REJECTION_REASONS[0]);
                                setCustomRejectionReason('');
                              }}
                              disabled={isUpdating || isCancelled}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isCancelled
                                  ? 'bg-red-50 dark:bg-red-950/80 text-red-600 border border-red-300 dark:border-red-800 cursor-not-allowed opacity-75'
                                  : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-sm'
                              }`}
                              title={isCancelled ? 'Already rejected' : 'Reject this booking appointment'}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{isCancelled ? 'Rejected' : 'Reject'}</span>
                            </button>

                            {/* Send WhatsApp Status Message */}
                            <a
                              href={getAdminUpdateWhatsAppUrl(
                                booking,
                                isConfirmed ? 'confirmed' : isCancelled ? 'cancelled' : 'general',
                                booking.rejectionReason
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Send current status update to customer on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>

                            {/* Email info to Admin (Rekha Devi Pal) */}
                            <button
                              onClick={() => setSelectedEmailBooking(booking)}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              title={`Send this booking info to ${PRIMARY_ADMIN_EMAIL}`}
                            >
                              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="hidden xl:inline">Email Info</span>
                            </button>

                            {/* Reset to Pending if needed */}
                            {!isPending && (
                              <button
                                onClick={() => handleResetToPending(booking)}
                                disabled={isUpdating}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                title="Reset status to Pending"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View: Cards Layout */}
        <div className="block lg:hidden mt-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Quick Mobile Action Cards
          </h3>
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            const isCancelled = booking.status === 'cancelled';
            const isPending = booking.status === 'pending';

            return (
              <div
                key={`mobile-${booking.id}`}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs transition-all ${
                  isPending
                    ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/10'
                    : isConfirmed
                    ? 'border-emerald-200 dark:border-emerald-800/80'
                    : 'border-red-200 dark:border-red-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {booking.customerName}
                    </h4>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      {booking.phoneNumber}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isCancelled
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                    }`}
                  >
                    {isConfirmed ? 'Accepted' : isCancelled ? 'Rejected' : 'Pending Action'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{booking.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{booking.appointmentTime}</span>
                    </div>
                  </div>
                  {isCancelled && booking.rejectionReason && (
                    <div className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                      <strong>Rejection Reason:</strong> {booking.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAcceptingBooking(booking)}
                    disabled={isConfirmed}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isConfirmed
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-300 opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isConfirmed ? 'Accepted' : 'Accept'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setRejectingBooking(booking);
                      setRejectionReason(COMMON_REJECTION_REASONS[0]);
                      setCustomRejectionReason('');
                    }}
                    disabled={isCancelled}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCancelled
                        ? 'bg-red-50 dark:bg-red-950 text-red-600 border border-red-300 opacity-60'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isCancelled ? 'Rejected' : 'Reject'}</span>
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <a
                      href={getAdminUpdateWhatsAppUrl(
                        booking,
                        isConfirmed ? 'confirmed' : isCancelled ? 'cancelled' : 'general',
                        booking.rejectionReason
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSelectedEmailBooking(booking)}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Info</span>
                    </button>
                  </div>

                  {!isPending && (
                    <button
                      onClick={() => handleResetToPending(booking)}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-open</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* ACCEPT CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {acceptingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Accept & Confirm Appointment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Approve booking request and notify the customer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAcceptingBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Booking Details Card */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900 dark:text-white">{acceptingBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{acceptingBooking.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{acceptingBooking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date & Time:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {acceptingBooking.appointmentDate} at {acceptingBooking.appointmentTime}
                </span>
              </div>
            </div>

            {/* Notify via WhatsApp Toggle */}
            <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer"
              onClick={() => setNotifyAcceptOnWhatsApp(!notifyAcceptOnWhatsApp)}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Send Acceptance Message on WhatsApp to Customer
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyAcceptOnWhatsApp}
                onChange={(e) => setNotifyAcceptOnWhatsApp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setAcceptingBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => handleConfirmAccept(acceptingBooking, notifyAcceptOnWhatsApp)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Accept Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REJECT MODAL WITH REASON SELECTION */}
      {/* ========================================================= */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Reject Booking Appointment
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Decline appointment and provide a clear reason to the client
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRejectingBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Booking Info */}
            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3.5 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900 dark:text-white">{rejectingBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{rejectingBooking.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Slot:</span>
                <span className="font-semibold text-red-700 dark:text-red-300">
                  {rejectingBooking.appointmentDate} at {rejectingBooking.appointmentTime} ({rejectingBooking.service})
                </span>
              </div>
            </div>

            {/* Reason Presets */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Select Reason for Rejection:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {COMMON_REJECTION_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`p-2 rounded-xl text-xs flex items-center gap-2 border cursor-pointer transition-all ${
                      rejectionReason === reason && !customRejectionReason
                        ? 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={reason}
                      checked={rejectionReason === reason && !customRejectionReason}
                      onChange={() => {
                        setRejectionReason(reason);
                        setCustomRejectionReason('');
                      }}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Or Write Custom Reason / Notes:
              </label>
              <textarea
                rows={2}
                placeholder="Type custom rejection note or alternative suggestion..."
                value={customRejectionReason}
                onChange={(e) => setCustomRejectionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* WhatsApp notification option */}
            <div
              className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer"
              onClick={() => setNotifyCustomerOnWhatsApp(!notifyCustomerOnWhatsApp)}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Send Rejection & Reason to Customer on WhatsApp
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyCustomerOnWhatsApp}
                onChange={(e) => setNotifyCustomerOnWhatsApp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectingBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL DASHBOARD REPORT EMAIL MODAL (webnova88@gmail.com) */}
      {/* ========================================================= */}
      {showEmailReportModal && (() => {
        const report = buildFullDashboardReportEmail(bookings);
        const gmailUrl = getGmailWebComposeUrl(report.to, report.subject, report.body);
        const mailtoUrl = getMailtoUrl(report.to, report.subject, report.body);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Dispatch Full Dashboard Report to Admin
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Send complete appointment digest & status breakdown to <strong>{PRIMARY_ADMIN_EMAIL}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailReportModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Recipient Badge & Stats */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-3.5 mb-4 text-xs space-y-2 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Official Recipient: </span>
                    <span className="font-bold text-slate-900 dark:text-white">{ADMIN_NAME}</span>{' '}
                    <span className="font-mono text-blue-700 dark:text-blue-300 font-semibold">
                      ({PRIMARY_ADMIN_EMAIL})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold self-start sm:self-auto">
                    Super Admin ID
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
                  <div className="text-center">
                    <span className="block text-slate-500 dark:text-slate-400 text-[10px]">Total Bookings</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{totalBookings}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-amber-600 dark:text-amber-400 text-[10px]">Pending</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{pendingCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-emerald-600 dark:text-emerald-400 text-[10px]">Accepted</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{confirmedCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-red-600 dark:text-red-400 text-[10px]">Rejected</span>
                    <span className="font-bold text-red-600 dark:text-red-400 text-sm">{cancelledCount}</span>
                  </div>
                </div>
              </div>

              {/* Formatted Content Preview */}
              <div className="flex-1 min-h-0 flex flex-col mb-4">
                <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Generated Email Content Preview:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDashboardReport}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDashboardReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Report Text</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-700">
                  {report.body}
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 flex-shrink-0 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEmailReportModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={mailtoUrl}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-blue-500" />
                  <span>Open in Mail App</span>
                </a>

                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Gmail Web ({PRIMARY_ADMIN_EMAIL})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* SINGLE BOOKING EMAIL DISPATCH MODAL (webnova88@gmail.com) */}
      {/* ========================================================= */}
      {selectedEmailBooking && (() => {
        const emailData = buildSingleBookingEmail(selectedEmailBooking);
        const gmailUrl = getGmailWebComposeUrl(emailData.to, emailData.subject, emailData.body);
        const mailtoUrl = getMailtoUrl(emailData.to, emailData.subject, emailData.body);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Send Booking Info to Admin
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Deliver details for {selectedEmailBooking.customerName} to <strong>{PRIMARY_ADMIN_EMAIL}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmailBooking(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target Booking Info Card */}
              <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-3.5 mb-4 text-xs space-y-1.5 flex-shrink-0">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEmailBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{selectedEmailBooking.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedEmailBooking.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Appointment Slot:</span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {selectedEmailBooking.appointmentDate} at {selectedEmailBooking.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold uppercase tracking-wider text-xs">
                    {selectedEmailBooking.status}
                  </span>
                </div>
              </div>

              {/* Preview Body */}
              <div className="flex-1 min-h-0 flex flex-col mb-4">
                <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Message Preview:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySingleBookingReport(selectedEmailBooking)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSingleReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed border border-slate-700">
                  {emailData.body}
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 flex-shrink-0 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedEmailBooking(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <a
                  href={mailtoUrl}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-blue-500" />
                  <span>Send via Mail App</span>
                </a>

                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send to Admin via Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Netlify Deployment Modal */}
      {showNetlifyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                    <span>Update Live Site on Netlify</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold">
                      Ready to Deploy
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deploy your latest updates (Direct Email &amp; No-WhatsApp Flow) to Netlify in 10 seconds.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNetlifyModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Option: Netlify Drop (Fastest) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 via-emerald-50/50 to-white dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-900 border border-teal-200 dark:border-teal-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Instant Update via Netlify Drop (No Coding Needed)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                  Recommended
                </span>
              </div>

              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pl-1">
                <li>
                  Neeche diye gaye button se <strong className="text-teal-700 dark:text-teal-300 font-mono">webnova-dist-netlify-drop.zip</strong> download karein.
                </li>
                <li>
                  <strong>Netlify Drop</strong> (<a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">app.netlify.com/drop</a>) open karein.
                </li>
                <li>
                  Download ki hui ZIP file ko Netlify Drop box me drag &amp; drop kar dein. <strong>Site turant 100% live update ho jaayegi!</strong>
                </li>
              </ol>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="/webnova-dist-netlify-drop.zip"
                  download="webnova-dist-netlify-drop.zip"
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Netlify ZIP</span>
                </a>

                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Netlify Drop</span>
                </a>
              </div>
            </div>

            {/* Option 2: Git Continuous Deployment Settings */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>Agar aap GitHub / Git se connected hain:</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Netlify settings me ye values pre-configured hain (<code className="font-mono text-blue-600 dark:text-blue-400 font-semibold">netlify.toml</code>):
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Build Command:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">npm run build</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Publish Directory:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">dist</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowNetlifyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

