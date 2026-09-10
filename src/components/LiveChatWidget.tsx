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
} from 'lucide-react';
import { COMPANY_INFO } from '../data/webnovaData.ts';
import { ChatMessage } from '../types/index.ts';

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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Hello! 👋 Welcome to WEBNOVA. I'm your digital support assistant. How can we help scale your business today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What is your delivery turnaround?',
    'How much does an E-Commerce site cost?',
    'Do you provide 24/7 maintenance?',
    'Connect directly with Founders',
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

  const generateReply = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('turnaround') || input.includes('time') || input.includes('how long')) {
      return `Standard custom websites take 2 to 4 weeks, while robust e-commerce stores take 3 to 5 weeks. We also provide expedited 10-day sprints for urgent launches!`;
    }
    if (input.includes('price') || input.includes('cost') || input.includes('rate') || input.includes('ecommerce') || input.includes('how much')) {
      return `Our packages start at ₹19,999 for Business Websites, ₹24,999 for Custom Website Development, and ₹39,999 for full-featured E-Commerce stores with UPI and payment gateways. You can also book a free consultation for an exact quote!`;
    }
    if (input.includes('maintenance') || input.includes('support') || input.includes('uptime')) {
      return `Yes! We provide ongoing Website Maintenance starting at ₹4,999/month. This includes 24/7 uptime monitoring, daily cloud backups, security patches, and direct developer support.`;
    }
    if (input.includes('founder') || input.includes('anand') || input.includes('suryapartap') || input.includes('call') || input.includes('phone') || input.includes('whatsapp')) {
      return `You can reach our leadership directly! Anand Pal (Founder & CEO) & Suryapartap Pal (Co-Founder & Director) are available via Call or WhatsApp at +91 9519832055, or email hello@webnova.in.`;
    }
    if (input.includes('consultation') || input.includes('book') || input.includes('meeting') || input.includes('schedule')) {
      return `You can book an initial consultation directly through our automated scheduler on this page. We'll automatically generate a Google Meet link and calendar invitation!`;
    }
    if (input.includes('seo') || input.includes('marketing') || input.includes('google')) {
      return `We provide comprehensive SEO and Performance Marketing (Meta & Google Ads) tailored to boost organic ranking and deliver measurable return on ad spend (ROAS).`;
    }

    return `Thank you for your message! Our team in Mumbai is reviewing your inquiry. For immediate assistance or direct quotation, you can also message us directly on WhatsApp at +91 9519832055.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateReply(query);
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: replyText,
        timestamp: 'Just now',
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
      playNotificationSound();
    }, 850);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'agent',
        text: `Chat reset. How can WEBNOVA assist your digital business today?`,
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
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-bounce">
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
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[580px] h-[520px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs">
                  WN
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-heading">WEBNOVA Support Desk</h4>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span>Mumbai HQ • Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetChat}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
                title="Restart chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Banner inside chat */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium truncate">
              Prefer WhatsApp? Chat at +91 9519832055
            </span>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 ml-2 flex-shrink-0"
            >
              <span>Open</span>
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
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

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
              placeholder="Ask WEBNOVA anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
