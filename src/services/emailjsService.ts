/**
 * EmailJS Integration Service for WEBNOVA Booking Notifications
 * Sends appointment booking details to webnova88@gmail.com
 */

import emailjs from '@emailjs/browser';
import { BookingRecord } from './bookingDb.ts';

/**
 * Validates and sanitizes an email address string.
 * If the value does not contain '@' and '.', returns the fallback.
 */
function sanitizeEmail(val: unknown, fallback: string): string {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.includes('@') && trimmed.includes('.')) {
      return trimmed;
    }
  }
  return fallback;
}

/**
 * Strips whitespace, surrounding quotes, or brackets from config values.
 */
function sanitizeConfig(val: unknown, fallback: string): string {
  if (typeof val === 'string') {
    const cleaned = val.trim().replace(/^['"\[]+|['"\]]+$/g, '');
    if (cleaned.length > 0) {
      return cleaned;
    }
  }
  return fallback;
}

// Configured values from environment or verified defaults
const rawServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID;
const rawTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID;
const rawPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.EMAILJS_PUBLIC_KEY;
const rawRecipient = import.meta.env.VITE_EMAILJS_RECIPIENT_EMAIL || import.meta.env.EMAILJS_RECIPIENT_EMAIL;

export const EMAILJS_SERVICE_ID = sanitizeConfig(rawServiceId, 'service_obkgwvo');
export const EMAILJS_TEMPLATE_ID = sanitizeConfig(rawTemplateId, 'template_lb3d1q9');
export const EMAILJS_PUBLIC_KEY = sanitizeConfig(rawPublicKey, 'mbnQWixG-XjngYmHQ');

// Strictly ensure recipient is a valid email, never a public key or misconfigured token
export const ADMIN_NOTIFICATION_EMAIL = sanitizeEmail(rawRecipient, 'webnova88@gmail.com');

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: unknown;
  serviceUsed?: string;
}

/**
 * Builds template parameters mapping all booking fields.
 */
function buildTemplateParams(booking: BookingRecord): Record<string, unknown> {
  const subjectLine = `New Appointment Booking - ${booking.customerName}`;

  const fullSummary = [
    `NEW APPOINTMENT BOOKING NOTIFICATION`,
    `----------------------------------------`,
    `Customer Name: ${booking.customerName}`,
    `Phone Number: ${booking.phoneNumber}`,
    `Email Address: ${booking.email ? booking.email : 'Not provided'}`,
    `Booking Date: ${booking.appointmentDate}`,
    `Booking Time: ${booking.appointmentTime}`,
    `Service / Type: ${booking.service}`,
    `Additional Notes / Message: ${booking.notes ? booking.notes : 'None'}`,
    `Booking Reference ID: ${booking.id}`,
    `Booking Status: ${booking.status.toUpperCase()}`,
    `----------------------------------------`,
    `Notification Target: ${ADMIN_NOTIFICATION_EMAIL}`,
    `Submitted At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
  ].join('\n');

  return {
    subject: subjectLine,
    to_email: ADMIN_NOTIFICATION_EMAIL,
    to_name: 'WEBNOVA Admin (webnova88@gmail.com)',

    // Customer Identity Fields
    customer_name: booking.customerName,
    name: booking.customerName,
    from_name: booking.customerName,

    // Contact Fields
    phone_number: booking.phoneNumber,
    phone: booking.phoneNumber,
    customer_phone: booking.phoneNumber,
    contact: booking.phoneNumber,

    email: booking.email || 'Not provided',
    customer_email: booking.email || 'Not provided',
    reply_to: booking.email || ADMIN_NOTIFICATION_EMAIL,

    // Appointment Schedule Fields
    booking_date: booking.appointmentDate,
    appointment_date: booking.appointmentDate,
    date: booking.appointmentDate,

    booking_time: booking.appointmentTime,
    appointment_time: booking.appointmentTime,
    time: booking.appointmentTime,

    // Service & Requirements Fields
    service: booking.service,
    service_type: booking.service,
    appointment_type: booking.service,

    // Additional Notes / Messages
    notes: booking.notes || 'No additional notes provided',
    message: booking.notes ? booking.notes : fullSummary,
    additional_notes: booking.notes || 'No additional notes provided',

    // Full overview and metadata
    booking_id: booking.id,
    booking_summary: fullSummary,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Dispatches an automated email notification via EmailJS to webnova88@gmail.com
 * when a customer submits an appointment booking form.
 *
 * This function is non-blocking and error-tolerant:
 * It attempts delivery using the configured credentials. If a service ID error is returned,
 * it tries fallback pairs to ensure high reliability before logging to console.
 */
export async function sendBookingEmailViaEmailJS(
  booking: BookingRecord
): Promise<EmailDispatchResult> {
  const templateParams = buildTemplateParams(booking);

  // Candidate credential sets to try in sequence
  const candidatePairs = [
    // Primary configured pair
    {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY,
    },
    // User credentials explicit pair
    {
      serviceId: 'service_obkgwvo',
      templateId: 'template_lb3d1q9',
      publicKey: 'mbnQWixG-XjngYmHQ',
    },
    // Previous verified pairs as resilient fallback
    {
      serviceId: 'service_mo3ay8k',
      templateId: 'template_5siswpi',
      publicKey: 'mbnQWixG-XjngYmHQ',
    },
    {
      serviceId: 'service_ukmff1i',
      templateId: 'template_8qxudy4',
      publicKey: 'IXsOhaPJ6m_SwqGPO',
    },
  ];

  // Deduplicate pairs
  const seen = new Set<string>();
  const uniquePairs = candidatePairs.filter((p) => {
    const key = `${p.serviceId}|${p.templateId}|${p.publicKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(p.serviceId && p.templateId && p.publicKey);
  });

  let lastError: unknown = null;

  for (let i = 0; i < uniquePairs.length; i++) {
    const pair = uniquePairs[i];
    try {
      emailjs.init(pair.publicKey);
      const response = await emailjs.send(
        pair.serviceId,
        pair.templateId,
        templateParams,
        pair.publicKey
      );

      console.log(
        `[EmailJS] Booking notification successfully delivered to ${ADMIN_NOTIFICATION_EMAIL} using service "${pair.serviceId}". Status: ${response.status} - ${response.text}`
      );

      return {
        success: true,
        messageId: `${response.status}`,
        serviceUsed: pair.serviceId,
      };
    } catch (err: unknown) {
      lastError = err;
      const errStr = typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err);
      
      // If error is not a service ID mismatch, or if we have more candidates, continue to next
      if (i < uniquePairs.length - 1) {
        // Try next candidate pair
        continue;
      }

      // If all candidates exhausted, log graceful diagnostic
      console.error(
        `[EmailJS] Failed to send booking notification email to ${ADMIN_NOTIFICATION_EMAIL}:`,
        err
      );
      if (errStr.includes('The service ID not found')) {
        console.warn(
          `[EmailJS Troubleshooting] Make sure you have created an Email Service in https://dashboard.emailjs.com/admin and that the Service ID in .env matches your connected service.`
        );
      }
    }
  }

  return {
    success: false,
    error: lastError,
  };
}
