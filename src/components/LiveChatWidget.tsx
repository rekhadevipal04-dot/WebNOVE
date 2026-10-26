import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Phone,
  Volume2,
  VolumeX,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  CheckCheck,
  Zap,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/webnovaData.ts';
import { ChatMessage } from '../types/index.ts';
import {
  dispatchSupportChatInquiry,
  getDirectWhatsAppChatUrl,
  WHATSAPP_DESK_DISPLAY,
  WHATSAPP_DESK_NUMBER,
} from '../services/supportChatService.ts';

interface LiveChatWidgetProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [clientPhone, setClientPhone] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('webnova_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.phone || '';
      }
    } catch {}
    return localStorage.getItem('webnova_chat_client_phone') || '';
  });
  const [clientName, setClientName] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('webnova_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.name || '';
      }
    } catch {}
    return localStorage.getItem('webnova_chat_client_name') || '';
  });
  const [showPhoneCapture, setShowPhoneCapture] = useState(false);
  const [tempPhone, setTempPhone] = useState('');

  const [messages, setMessages] = useState<(ChatMessage & { whatsappUrl?: string; forwardedToWhatsApp?: boolean })[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Hello! 👋 Welcome to WEBNOVA Support Desk. Every query you send here is connected directly to our Executive WhatsApp Desk (${WHATSAPP_DESK_DISPLAY}). How can we help scale your business today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What is your delivery turnaround?',
    'How much does an E-Commerce site cost?',
    'Do you provide 24/7 maintenance?',
    'Connect directly on WhatsApp',
    'Book an initial consultation',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const generateReply = (userInput: string): { reply: string; showWhatsAppAction: boolean } => {
    const input = userInput.toLowerCase();

    if (input.includes('turnaround') || input.includes('time') || input.includes('how long')) {
      return {
        reply: `Standard custom websites take 2 to 4 weeks, while robust e-commerce stores take 3 to 5 weeks. We also provide expedited 10-day sprints for urgent launches!`,
        showWhatsAppAction: true,
      };
    }
    if (input.includes('price') || input.includes('cost') || input.includes('rate') || input.includes('ecommerce') || input.includes('how much')) {
      return {
        reply: `Our packages start at ₹19,999 for Business Websites, ₹24,999 for Custom Website Development, and ₹39,999 for full-featured E-Commerce stores with UPI and payment gateways. We can also provide an exact quotation on WhatsApp!`,
        showWhatsAppAction: true,
      };
    }
    if (input.includes('maintenance') || input.includes('support') || input.includes('uptime')) {
      return {
        reply: `Yes! We provide ongoing Website Maintenance starting at ₹4,999/month. This includes 24/7 uptime monitoring, daily cloud backups, security patches, and direct developer support.`,
        showWhatsAppAction: true,
      };
    }
    if (input.includes('team') || input.includes('call') || input.includes('phone') || input.includes('whatsapp') || input.includes('contact')) {
      return {
        reply: `Our agency technical and strategy team is available directly! We monitor this desk 24/7 and are reachable via WhatsApp or Call at ${WHATSAPP_DESK_DISPLAY}.`,
        showWhatsAppAction: true,
      };
    }
    if (input.includes('consultation') || input.includes('book') || input.includes('meeting') || input.includes('schedule')) {
      return {
        reply: `You can book an initial consultation directly through our automated scheduler on this page. We'll automatically generate a Google Meet link and calendar invitation!`,
        showWhatsAppAction: true,
      };
    }
    if (input.includes('seo') || input.includes('marketing') || input.includes('google')) {
      return {
        reply: `We provide comprehensive SEO and Performance Marketing (Meta & Google Ads) tailored to boost organic ranking and deliver measurable return on ad spend (ROAS).`,
        showWhatsAppAction: true,
      };
    }

    return {
      reply: `Thank you! Your message has been sent directly to our Executive WhatsApp Desk (${WHATSAPP_DESK_DISPLAY}). Our technical engineering team in Mumbai is reviewing your inquiry.`,
      showWhatsAppAction: true,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const currentQuery = query.trim();

    // 1. Instantly dispatch to WhatsApp Desk in background (Email alert + localStorage + WhatsApp URL)
    const directWaUrl = getDirectWhatsAppChatUrl(currentQuery, clientName, clientPhone);
    dispatchSupportChatInquiry(currentQuery, clientName, clientPhone);

    const userMsg: ChatMessage & { whatsappUrl?: string; forwardedToWhatsApp?: boolean } = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: currentQuery,
      timestamp: 'Just now',
      forwardedToWhatsApp: true,
      whatsappUrl: directWaUrl,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // If client hasn't given their phone number yet, reveal prompt after first query
    if (!clientPhone) {
      setShowPhoneCapture(true);
    }

    setTimeout(() => {
      const { reply, showWhatsAppAction } = generateReply(currentQuery);
      const agentMsg: ChatMessage & { whatsappUrl?: string; forwardedToWhatsApp?: boolean } = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: reply,
        timestamp: 'Just now',
        whatsappUrl: showWhatsAppAction ? directWaUrl : undefined,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
      playNotificationSound();
    }, 600);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPhone.trim()) return;

    const sanitized = tempPhone.trim();
    setClientPhone(sanitized);
    localStorage.setItem('webnova_chat_client_phone', sanitized);
    setShowPhoneCapture(false);
    setTempPhone('');

    // Dispatched updated phone inquiry
    dispatchSupportChatInquiry(`Client added phone number: ${sanitized}`, clientName, sanitized);

    const confirmationMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text: `✅ Thank you! Your phone number (${sanitized}) has been registered with our WhatsApp Desk. Anand Pal or an executive engineer will reach out promptly.`,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, confirmationMsg]);
    playNotificationSound();
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'agent',
        text: `Chat reset. Every inquiry sent here goes directly to WhatsApp Desk (${WHATSAPP_DESK_DISPLAY}). How can WEBNOVA assist your business?`,
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open live chat"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out pl-0 group-hover:pl-2 text-xs font-bold">
              Chat With WEBNOVA
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[600px] h-[540px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs">
                  WN
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold font-heading">WEBNOVA Support Desk</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    WhatsApp Connected
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span>Mumbai HQ • Live 24/7 Desk</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetChat}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Restart chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Direct Routing Banner */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/40 px-3 py-1.5 border-b border-emerald-500/20 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="truncate">Direct to WhatsApp: {WHATSAPP_DESK_DISPLAY}</span>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_DESK_NUMBER}&text=${encodeURIComponent('Hello Anand Pal / WEBNOVA team, I am connecting from the live support desk.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* If agent message includes WhatsApp direct action */}
                  {msg.sender === 'agent' && msg.whatsappUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <a
                        href={msg.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition shadow-sm hover:shadow-emerald-500/20 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Continue on WhatsApp ({WHATSAPP_DESK_DISPLAY})</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-1">
                    {msg.sender === 'user' && msg.forwardedToWhatsApp && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-blue-200">
                        <CheckCheck className="w-3 h-3 text-emerald-300" />
                        <span>Dispatched to WhatsApp Desk</span>
                      </span>
                    )}
                    <span
                      className={`block text-[9px] ${
                        msg.sender === 'user' ? 'text-blue-200 ml-auto' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Seamless Phone Number Capture prompt if client hasn't added phone */}
            {showPhoneCapture && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in duration-300">
                <p className="font-semibold text-[11px] text-blue-900 dark:text-blue-200 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>Receive direct WhatsApp reply &amp; official quote:</span>
                </p>
                <form onSubmit={handleSavePhone} className="flex gap-1.5">
                  <input
                    type="tel"
                    placeholder="Enter your phone/WhatsApp..."
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] whitespace-nowrap border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask WEBNOVA anything... (sent to WhatsApp Desk)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
              aria-label="Send message"
              title="Send directly to WhatsApp Desk"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

