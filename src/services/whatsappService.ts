/**
 * WhatsApp Integration Service for WEBNOVA Appointments
 */

export interface AppointmentData {
  id: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
  rejectionReason?: string;
  status?: string;
}

/**
 * Normalizes phone numbers to standard WhatsApp format with country code (defaults to India 91)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');

  // If already prefixed with 91 and has 12 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  // Standard 10-digit Indian mobile number
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // 11 digits starting with 0 (e.g. 09519832055)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Builds a formatted WhatsApp message containing complete appointment information
 */
export function buildAppointmentWhatsAppMessage(
  booking: AppointmentData,
  recipientType: 'customer' | 'agency' = 'customer'
): string {
  const statusLabel = (booking.status || 'Pending').toUpperCase();

  if (recipientType === 'agency') {
    return `🚨 *NEW APPOINTMENT BOOKING RECEIVED*
━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Booking Ref:* ${booking.id}
👤 *Client Name:* ${booking.customerName}
📞 *Client Phone:* ${booking.phoneNumber}
💼 *Service:* ${booking.service}
🗓️ *Date:* ${booking.appointmentDate}
⏰ *Time:* ${booking.appointmentTime}
${booking.email ? `✉️ *Email:* ${booking.email}\n` : ''}${booking.notes ? `📝 *Client Notes:* ${booking.notes}\n` : ''}📌 *Status:* ${statusLabel}
━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Action:* Please confirm or assign consultant in Admin Dashboard.`;
  }

  return `*WEBNOVA DIGITAL APPOINTMENT CONFIRMATION* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*, your appointment details are recorded below:

📋 *Booking Ref:* ${booking.id}
💼 *Service:* ${booking.service}
🗓️ *Date:* ${booking.appointmentDate}
⏰ *Time:* ${booking.appointmentTime}
📞 *Registered Phone:* ${booking.phoneNumber}
${booking.email ? `✉️ *Email:* ${booking.email}\n` : ''}${booking.notes ? `📝 *Project Notes:* ${booking.notes}\n` : ''}📌 *Status:* ${statusLabel}
━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *Agency:* WEBNOVA Digital Marketing Agency, Mumbai
🌐 *Website:* https://webnova.in
📞 *Direct Support / Desk:* +91 95198 32055

_Our digital consultant will connect with you at your chosen appointment time. Keep this message for your reference._`;
}

/**
 * Returns WhatsApp click-to-chat URL for customer's phone number
 */
export function getCustomerWhatsAppUrl(booking: AppointmentData): string {
  const phone = formatPhoneForWhatsApp(booking.phoneNumber);
  const message = buildAppointmentWhatsAppMessage(booking, 'customer');
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

/**
 * Returns WhatsApp click-to-chat URL for WEBNOVA official desk (+91 95198 32055)
 */
export function getAgencyWhatsAppUrl(booking: AppointmentData): string {
  const message = buildAppointmentWhatsAppMessage(booking, 'agency');
  return `https://api.whatsapp.com/send?phone=919519832055&text=${encodeURIComponent(message)}`;
}

/**
 * Returns WhatsApp click-to-chat URL with a status update message for admin (Accept / Reject)
 */
export function getAdminUpdateWhatsAppUrl(
  booking: AppointmentData,
  updateType: 'confirmed' | 'cancelled' | 'general',
  reason?: string
): string {
  const phone = formatPhoneForWhatsApp(booking.phoneNumber);
  let statusText = '';
  if (updateType === 'confirmed') {
    statusText = `✅ *APPOINTMENT ACCEPTED & CONFIRMED!*
Great news! Your booking has been approved and accepted by WEBNOVA Admin. Our senior digital consultant is scheduled to meet you on *${booking.appointmentDate}* at *${booking.appointmentTime}*.`;
  } else if (updateType === 'cancelled') {
    statusText = `❌ *APPOINTMENT REJECTED / CANCELLED*
We regret to inform you that your booking for *${booking.service}* on *${booking.appointmentDate}* at *${booking.appointmentTime}* could not be accepted.${
      reason ? `\n\n📌 *Reason for Rejection:* ${reason}` : ''
    }\n\nIf you would like to reschedule for an alternate date or time slot, please reply to this WhatsApp message directly.`;
  } else {
    statusText = `ℹ️ *Update regarding your appointment:* ${booking.service} on ${booking.appointmentDate} at ${booking.appointmentTime}.`;
  }

  const message = `*WEBNOVA APPOINTMENT STATUS NOTIFICATION* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━
Dear *${booking.customerName}*,

${statusText}

📋 *Booking Ref:* ${booking.id}
💼 *Service:* ${booking.service}
🗓️ *Date:* ${booking.appointmentDate}
⏰ *Time:* ${booking.appointmentTime}
${booking.notes ? `📝 *Your Notes:* ${booking.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 *WEBNOVA Digital Marketing Agency, Mumbai*
📞 *Helpline / WhatsApp:* +91 95198 32055
🌐 *Website:* https://webnova.in`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
