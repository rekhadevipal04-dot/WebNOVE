/**
 * Admin Email Dispatch & Notification Service for WEBNOVA
 * Primary Super Administrator: Rekha Devi Pal (rekhadevipal04@gmail.com)
 */

import { BookingRecord } from './bookingDb.ts';

export const PRIMARY_ADMIN_EMAIL = 'rekhadevipal04@gmail.com';
export const SECONDARY_ADMIN_EMAIL = 'rekhadevipal04@gamil.com';
export const ADMIN_NAME = 'Rekha Devi Pal';
export const ADMIN_ROLE = 'Super Administrator';

/**
 * Builds formatted email contents for a single booking notification
 */
export function buildSingleBookingEmail(booking: BookingRecord): {
  to: string;
  subject: string;
  body: string;
} {
  const subject = `[WEBNOVA Admin Alert] Booking: ${booking.customerName} - ${booking.service} (${booking.appointmentDate})`;

  const body = `WEBNOVA APPOINTMENT NOTIFICATION FOR ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recipient: ${ADMIN_NAME} (${PRIMARY_ADMIN_EMAIL})
Notice: New appointment recorded in WEBNOVA Database
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER INFORMATION:
• Full Name: ${booking.customerName}
• Phone Number: ${booking.phoneNumber}
• Email Address: ${booking.email || 'Not provided'}

APPOINTMENT SCHEDULE:
• Service Requested: ${booking.service}
• Date: ${booking.appointmentDate}
• Time: ${booking.appointmentTime}
• Booking Reference: ${booking.id}
• Current Status: ${booking.status.toUpperCase()}
${booking.rejectionReason ? `• Rejection Reason: ${booking.rejectionReason}\n` : ''}
${booking.notes ? `CLIENT NOTES:\n"${booking.notes}"\n\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMIN ACTION OPTIONS:
1. Open Admin Dashboard to Accept or Reject:
   https://ais-dev-dq5f3gh4udclgskjz64cce-113505228715.asia-southeast1.run.app/#admin-dashboard

2. Connect with Client on WhatsApp:
   https://api.whatsapp.com/send?phone=91${booking.phoneNumber.replace(/[^0-9]/g, '')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEBNOVA Technologies & Digital Media LLP
Official Agency Desk: +91 95198 32055
Administrator: ${ADMIN_NAME} (${PRIMARY_ADMIN_EMAIL})
Report Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

  return {
    to: PRIMARY_ADMIN_EMAIL,
    subject,
    body,
  };
}

/**
 * Builds a complete dashboard summary digest of all appointments for the Admin
 */
export function buildFullDashboardReportEmail(bookings: BookingRecord[]): {
  to: string;
  subject: string;
  body: string;
} {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  const subject = `[WEBNOVA Admin Report] Full Dashboard Appointments Digest (${today})`;

  let body = `WEBNOVA APPOINTMENTS DASHBOARD REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Administrator: ${ADMIN_NAME} (${PRIMARY_ADMIN_EMAIL})
Report Date: ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE KPI SUMMARY:
• Total Bookings In Database: ${total}
• Pending Decision (Need Accept/Reject): ${pending.length}
• Accepted & Confirmed: ${confirmed.length}
• Cancelled / Rejected: ${cancelled.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PENDING REQUESTS AWAITING DECISION (${pending.length}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (pending.length === 0) {
    body += `No pending bookings. All appointment requests have been processed!\n\n`;
  } else {
    pending.forEach((b, i) => {
      body += `[${i + 1}] Ref: ${b.id}
• Customer: ${b.customerName}
• Contact: ${b.phoneNumber} | ${b.email || 'No email'}
• Service: ${b.service}
• Slot: ${b.appointmentDate} at ${b.appointmentTime}
${b.notes ? `• Notes: ${b.notes}\n` : ''}----------------------------------------\n`;
    });
  }

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ACCEPTED & CONFIRMED APPOINTMENTS (${confirmed.length}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (confirmed.length === 0) {
    body += `No accepted bookings recorded.\n\n`;
  } else {
    confirmed.forEach((b, i) => {
      body += `[${i + 1}] Ref: ${b.id}
• Customer: ${b.customerName} (${b.phoneNumber})
• Service: ${b.service}
• Date & Time: ${b.appointmentDate} at ${b.appointmentTime}
----------------------------------------\n`;
    });
  }

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. REJECTED / CANCELLED APPOINTMENTS (${cancelled.length}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (cancelled.length === 0) {
    body += `No cancelled or rejected bookings.\n\n`;
  } else {
    cancelled.forEach((b, i) => {
      body += `[${i + 1}] Ref: ${b.id}
• Customer: ${b.customerName} (${b.phoneNumber})
• Service: ${b.service}
• Reason: ${b.rejectionReason || 'No reason provided'}
----------------------------------------\n`;
    });
  }

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Access Full Live Dashboard:
https://ais-dev-dq5f3gh4udclgskjz64cce-113505228715.asia-southeast1.run.app/#admin-dashboard

WEBNOVA Technologies & Digital Media LLP
Lead Agency Desk: +91 95198 32055
Report Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;

  return {
    to: PRIMARY_ADMIN_EMAIL,
    subject,
    body,
  };
}

/**
 * Generates standard mailto URL
 */
export function getMailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Generates direct Google Webmail compose URL
 */
export function getGmailWebComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
