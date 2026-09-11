/**
 * Automated Silent Background Notification Service for WEBNOVA Admin
 * Directly notifies Admin at webnova88@gmail.com when an appointment is booked.
 *
 * Requirements:
 * 1. Client fills booking form -> Sees "Booking Submitted" confirmation on screen.
 * 2. NO WhatsApp message is sent to client's number (WhatsApp is not triggered).
 * 3. NO external tab, window, or local email client software is opened.
 * 4. Automated email notification is sent in the background to webnova88@gmail.com.
 */

import emailjs from '@emailjs/browser';
import { BookingRecord } from './bookingDb.ts';

export const ADMIN_NOTIFICATION_EMAIL = 'webnova88@gmail.com';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_obkgwvo';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_lb3d1q9';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mbnQWixG-XjngYmHQ';

export interface AutomatedNotifyResult {
  emailjsSuccess: boolean;
  formSubmitSuccess: boolean;
  details?: string;
}

/**
 * Sends automated background notification to webnova88@gmail.com
 * Completely silent and non-blocking — does NOT open any window, tab or app.
 */
export async function sendAutomatedAdminNotification(
  booking: BookingRecord
): Promise<AutomatedNotifyResult> {
  const subjectLine = `New Appointment Booking - ${booking.customerName}`;
  
  const templateParams: Record<string, unknown> = {
    subject: subjectLine,
    to_email: ADMIN_NOTIFICATION_EMAIL,
    to_name: 'WEBNOVA Admin (webnova88@gmail.com)',
    customer_name: booking.customerName,
    name: booking.customerName,
    from_name: booking.customerName,
    phone_number: booking.phoneNumber,
    phone: booking.phoneNumber,
    contact: booking.phoneNumber,
    email: booking.email || 'Not provided',
    customer_email: booking.email || 'Not provided',
    reply_to: booking.email || ADMIN_NOTIFICATION_EMAIL,
    booking_date: booking.appointmentDate,
    appointment_date: booking.appointmentDate,
    date: booking.appointmentDate,
    booking_time: booking.appointmentTime,
    appointment_time: booking.appointmentTime,
    time: booking.appointmentTime,
    service: booking.service,
    service_type: booking.service,
    appointment_type: booking.service,
    notes: booking.notes || 'None',
    message: booking.notes || 'None',
    booking_id: booking.id,
    timestamp: new Date().toISOString(),
  };

  let emailjsSuccess = false;
  let formSubmitSuccess = false;

  // 1. Silent Background Attempt: EmailJS (@emailjs/browser)
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const res = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    if (res.status === 200) {
      emailjsSuccess = true;
      console.log(`[AutoNotify] EmailJS sent booking alert to ${ADMIN_NOTIFICATION_EMAIL} (${res.status})`);
    }
  } catch (err) {
    console.warn('[AutoNotify] EmailJS silent dispatch notice:', err);
  }

  // 2. Redundant Silent Background Attempt: FormSubmit API direct to webnova88@gmail.com
  try {
    const fsResponse = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subjectLine,
        'Customer Name': booking.customerName,
        'Phone Number': booking.phoneNumber,
        'Email Address': booking.email || 'Not provided',
        'Appointment Date': booking.appointmentDate,
        'Appointment Time': booking.appointmentTime,
        'Service Requested': booking.service,
        'Customer Notes': booking.notes || 'None',
        'Booking Reference ID': booking.id,
        _template: 'table',
      }),
    });
    if (fsResponse.ok) {
      formSubmitSuccess = true;
      console.log(`[AutoNotify] FormSubmit dispatched alert to ${ADMIN_NOTIFICATION_EMAIL}`);
    }
  } catch (fsErr) {
    console.warn('[AutoNotify] FormSubmit background dispatch notice:', fsErr);
  }

  return {
    emailjsSuccess,
    formSubmitSuccess,
  };
}
