/**
 * Support Chat & Direct WhatsApp Forwarding Service
 * Automatically dispatches client support inquiries to WhatsApp Desk (+91 9519832055)
 * and notifies admin at webnova88@gmail.com without disrupting the client experience.
 */

import emailjs from '@emailjs/browser';
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  ADMIN_NOTIFICATION_EMAIL,
} from './emailjsService.ts';

export interface ChatInquiry {
  id: string;
  message: string;
  clientName?: string;
  clientPhone?: string;
  timestamp: string;
  createdAt: number;
  status: 'new' | 'reviewed' | 'resolved';
  forwardedToWhatsApp: boolean;
  sourceUrl?: string;
}

const STORAGE_KEY = 'webnova_support_inquiries';
export const WHATSAPP_DESK_NUMBER = '919519832055';
export const WHATSAPP_DESK_DISPLAY = '+91 9519832055';

/**
 * Normalizes phone numbers to standard WhatsApp format with country code (defaults to India 91)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Builds formatted WhatsApp message text for the client inquiry
 */
export function buildChatWhatsAppMessage(
  query: string,
  clientName?: string,
  clientPhone?: string
): string {
  const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `🚀 *NEW WEBNOVA LIVE SUPPORT CHAT INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━━
💬 *Message:*
"${query}"

${clientName ? `👤 *Client Name:* ${clientName}\n` : ''}${clientPhone ? `📞 *Client Phone:* ${clientPhone}\n` : ''}⏰ *Time:* ${timeStr} IST
🏢 *Source:* WEBNOVA Official Support Desk
━━━━━━━━━━━━━━━━━━━━━━━━━
_Direct inquiry from website visitor. Please reply or assign consultant._`;
}

/**
 * Generates direct click-to-chat WhatsApp URL for WEBNOVA official desk
 */
export function getDirectWhatsAppChatUrl(
  query: string,
  clientName?: string,
  clientPhone?: string
): string {
  const text = buildChatWhatsAppMessage(query, clientName, clientPhone);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_DESK_NUMBER}&text=${encodeURIComponent(text)}`;
}

/**
 * Retrieves all stored chat inquiries from local database
 */
export function getStoredChatInquiries(): ChatInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new chat inquiry and dispatches background notifications
 */
export async function dispatchSupportChatInquiry(
  message: string,
  clientName?: string,
  clientPhone?: string
): Promise<{ success: boolean; inquiry: ChatInquiry; whatsappUrl: string }> {
  const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const inquiry: ChatInquiry = {
    id: `CHAT-WN-${Date.now().toString().slice(-6)}`,
    message: message.trim(),
    clientName: clientName?.trim() || undefined,
    clientPhone: clientPhone?.trim() || undefined,
    timestamp: timeStr,
    createdAt: Date.now(),
    status: 'new',
    forwardedToWhatsApp: true,
    sourceUrl: window.location.href,
  };

  // 1. Persist in local storage
  try {
    const existing = getStoredChatInquiries();
    const updated = [inquiry, ...existing.slice(0, 99)]; // Keep latest 100
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch a custom window event for real-time reactivity in AdminDashboard
    window.dispatchEvent(new CustomEvent('webnova_new_chat_inquiry', { detail: inquiry }));
  } catch (err) {
    console.warn('[SupportChat] Local storage write error:', err);
  }

  const whatsappUrl = getDirectWhatsAppChatUrl(message, clientName, clientPhone);

  // 2. Dispatch silent email alert to webnova88@gmail.com in background
  try {
    const templateParams = {
      subject: `🚨 [LIVE CHAT INQUIRY] Direct to WhatsApp Desk - ${inquiry.id}`,
      to_email: ADMIN_NOTIFICATION_EMAIL,
      to_name: 'WEBNOVA Executive Desk',
      customer_name: clientName || 'Website Live Visitor',
      name: clientName || 'Website Live Visitor',
      phone_number: clientPhone || 'Provided via Live Chat',
      customer_phone: clientPhone || 'Provided via Live Chat',
      service: 'Live Support Chat Desk',
      message: `Message from client:\n"${message}"\n\nDirect WhatsApp Desk Link:\n${whatsappUrl}`,
      notes: `Direct inquiry from website visitor dispatched to WhatsApp ${WHATSAPP_DESK_DISPLAY}`,
      booking_id: inquiry.id,
      timestamp: timeStr,
    };

    emailjs.init(EMAILJS_PUBLIC_KEY);
    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    ).then((res) => {
      console.log('[SupportChat] Email notification dispatched to admin:', res.status);
    }).catch((err) => {
      console.warn('[SupportChat] Background email notification warning:', err);
    });
  } catch (err) {
    // Non-blocking, keep user experience seamless
    console.warn('[SupportChat] Email dispatch failed silently:', err);
  }

  return {
    success: true,
    inquiry,
    whatsappUrl,
  };
}

/**
 * Updates status of a chat inquiry in storage
 */
export function updateChatInquiryStatus(id: string, status: 'new' | 'reviewed' | 'resolved') {
  try {
    const list = getStoredChatInquiries();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('webnova_chat_inquiries_updated'));
  } catch (err) {
    console.error('[SupportChat] Update status error:', err);
  }
}

/**
 * Deletes a chat inquiry from storage
 */
export function deleteChatInquiry(id: string) {
  try {
    const list = getStoredChatInquiries();
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('webnova_chat_inquiries_updated'));
  } catch (err) {
    console.error('[SupportChat] Delete inquiry error:', err);
  }
}
