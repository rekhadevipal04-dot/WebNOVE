import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  MessageCircle,
  QrCode,
  Lock,
  Calendar,
  Layers,
  Briefcase,
  BookOpen,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { WebnovaLogo } from './WebnovaLogo.tsx';
import { NotificationCenter } from './NotificationCenter.tsx';
import { COMPANY_INFO } from '../data/webnovaData.ts';
import { AppNotification, ClientUser } from '../types/index.ts';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenQR: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
  currentUser: ClientUser | null;
  onOpenAuth: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearNotification: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  activeSection,
  onNavigate,
  onOpenQR,
  onOpenBooking,
  onOpenAdmin,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onAdminLogout,
  currentUser,
  onOpenAuth,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotification,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Standard client-facing navigation items
  const baseNavItems = [
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'customer-booking', label: 'Book Appointment', icon: Calendar },
    { id: 'portal', label: 'Client Vault', icon: Lock },
    { id: 'blog', label: 'Insights', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Only append Admin Dashboard if authorized agency admin is logged in
  const navItems = isAdminLoggedIn
    ? [
        ...baseNavItems,
        { id: 'admin-dashboard', label: 'Admin Dashboard', icon: ShieldCheck },
      ]
    : baseNavItems;

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/95 dark:bg-slate-950/95 border-b border-slate-100 dark:border-slate-900'
      }`}
    >
      {/* Top Banner with direct contact numbers & location */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Available for New Projects Q4 2026</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden md:inline font-mono">
              📍 {COMPANY_INFO.address}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={COMPANY_INFO.telUrl}
              className="hover:text-blue-400 flex items-center gap-1 font-mono transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{COMPANY_INFO.phoneFormatted}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 text-emerald-400 font-semibold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Direct</span>
            </a>
            <button
              onClick={onOpenQR}
              className="px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800/60 text-blue-300 text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              <QrCode className="w-2.5 h-2.5" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('hero')}
            className="cursor-pointer flex items-center"
          >
            <WebnovaLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Stack */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onClear={onClearNotification}
              onNavigate={handleNavClick}
            />

            {/* Dark Mode Switch */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Client Portal Button / User Avatar */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('portal')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/80 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Client Login</span>
              </button>
            )}

            {/* Agency Admin Access - Guarded by Passcode */}
            {isAdminLoggedIn ? (
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 text-xs font-bold shadow-xs">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 hover:underline text-blue-700 dark:text-blue-300 cursor-pointer"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Admin Mode</span>
                </button>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold border-l border-blue-200 dark:border-blue-800 pl-2 transition-colors cursor-pointer"
                    title="Lock and exit Admin Mode"
                  >
                    Lock
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Agency Admin Portal (Restricted)"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="text-[11px]">Staff</span>
              </button>
            )}

            {/* Primary Consultation Booking Button */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={COMPANY_INFO.telUrl}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-blue-500" />
                    {item.label}
                  </span>
                  <span className="text-slate-400 text-[10px]">→</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
                {onAdminLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onAdminLogout();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold"
                  >
                    Exit
                  </button>
                )}
              </div>
            ) : null}

            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Client Portal Access</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('portal');
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-2"
              >
                <span>Signed in as {currentUser.name} (Client Portal)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQR();
              }}
              className="w-full py-1.5 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 hover:underline"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Show Official Visiting Card &amp; QR Code</span>
            </button>

            {!isAdminLoggedIn && onOpenAdminLogin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full pt-1 text-center text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Agency Staff Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
