/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  Lock,
  QrCode,
  ArrowUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CustomerBookingForm } from './components/CustomerBookingForm.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { FounderSection } from './components/FounderSection.tsx';
import { PortfolioSection } from './components/PortfolioSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { ClientPortal } from './components/ClientPortal.tsx';
import { LiveChatWidget } from './components/LiveChatWidget.tsx';
import { QRCodeModal } from './components/QRCodeModal.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { Footer } from './components/Footer.tsx';
import {
  COMPANY_INFO,
  INITIAL_NOTIFICATIONS,
} from './data/webnovaData.ts';
import {
  ClientUser,
  ConsultationBooking,
  AppNotification,
} from './types/index.ts';
import {
  subscribeToBookings,
  getLocalBookings,
  BookingRecord,
} from './services/bookingDb.ts';

export default function App() {
  // 1. Dark Mode State with local storage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('webnova_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('webnova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('webnova_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    addToast(
      'info',
      darkMode ? 'Light Mode Enabled' : 'Dark Mode Enabled',
      darkMode ? 'Interface switched to clean daylight contrast.' : 'Interface switched to low-light navy contrast.'
    );
  };

  // 2. Navigation Active State & Admin Protection State
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('webnova_admin_auth') === 'true';
    }
    return false;
  });
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('webnova_admin_auth', 'true');
    setActiveSection('admin-dashboard');
    setTimeout(() => {
      const elem = document.getElementById('admin-dashboard');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('webnova_admin_auth');
    if (activeSection === 'admin-dashboard') {
      setActiveSection('hero');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    addToast('info', 'Admin Dashboard Locked', 'You have logged out. The administrative dashboard is now strictly hidden.');
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setActiveSection('admin-dashboard');
      const elem = document.getElementById('admin-dashboard');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'admin-dashboard') {
      handleOpenAdmin();
      return;
    }
    const targetId = sectionId === 'booking' ? 'customer-booking' : sectionId;
    setActiveSection(targetId);
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3. Database Bookings State with Real-Time Firestore Synchronization
  const [dbBookings, setDbBookings] = useState<BookingRecord[]>(() => getLocalBookings());

  useEffect(() => {
    // Purge any legacy fake mock data or names from local cache
    try {
      const cachedDb = localStorage.getItem('webnova_firestore_bookings_cache');
      if (cachedDb && (cachedDb.includes('mock-') || cachedDb.includes('Aarav') || cachedDb.includes('Ananya') || cachedDb.includes('Rohan') || cachedDb.includes('Vikram Singhania') || cachedDb.toLowerCase().includes('rahul') || cachedDb.toLowerCase().includes('mehta'))) {
        localStorage.removeItem('webnova_firestore_bookings_cache');
      }
      const cachedConsultations = localStorage.getItem('webnova_bookings');
      if (cachedConsultations && (cachedConsultations.toLowerCase().includes('rahul') || cachedConsultations.toLowerCase().includes('mehta') || cachedConsultations.includes('BOOK-WN-9142'))) {
        localStorage.removeItem('webnova_bookings');
      }
      const cachedUser = localStorage.getItem('webnova_user');
      if (cachedUser && (cachedUser.toLowerCase().includes('rahul') || cachedUser.toLowerCase().includes('mehta'))) {
        localStorage.removeItem('webnova_user');
        setCurrentUser(null);
      }
    } catch {
      // ignore
    }

    const unsubscribe = subscribeToBookings(
      (updatedList) => {
        setDbBookings(
          updatedList.filter(
            (b) =>
              !b.customerName?.toLowerCase().includes('rahul') &&
              !b.customerName?.toLowerCase().includes('mehta')
          )
        );
      },
      (err) => {
        console.warn('Real-time listener notice:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // 3. User Authentication State
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('webnova_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (
            parsed?.name?.toLowerCase().includes('rahul') ||
            parsed?.name?.toLowerCase().includes('mehta') ||
            parsed?.email?.toLowerCase().includes('rahul') ||
            parsed?.email?.toLowerCase().includes('mehta')
          ) {
            localStorage.removeItem('webnova_user');
            return null;
          }
          return parsed;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const handleLogin = (user: ClientUser) => {
    setCurrentUser(user);
    localStorage.setItem('webnova_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('webnova_user');
    addToast('info', 'Session Terminated', 'You have been logged out of the client portal.');
  };

  // 4. Consultation Bookings State (Clean, real entries only)
  const [bookings, setBookings] = useState<ConsultationBooking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('webnova_bookings');
      if (saved) {
        try {
          const parsed: ConsultationBooking[] = JSON.parse(saved);
          return parsed.filter(
            (b) =>
              !b.clientName?.toLowerCase().includes('rahul') &&
              !b.clientName?.toLowerCase().includes('mehta') &&
              !b.id.startsWith('mock-')
          );
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [prefilledService, setPrefilledService] = useState('');

  const handleBookingSuccess = (newBooking: ConsultationBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('webnova_bookings', JSON.stringify(updated));

    // Also dispatch an automated in-app notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Consultation Confirmed',
      message: `Meeting booked for ${newBooking.serviceType} on ${newBooking.date} at ${newBooking.timeSlot}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      actionLabel: 'View in Vault',
      actionUrl: '#portal',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'success',
      'Consultation Scheduled!',
      `Meeting link generated: ${newBooking.meetingLink}`
    );
  };

  const handleSelectServiceForBooking = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
    handleNavigate('booking');
  };

  // 5. Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 6. Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 7. Modals State
  const [qrModalOpen, setQrModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenQR={() => setQrModalOpen(true)}
        onOpenBooking={() => handleNavigate('customer-booking')}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        currentUser={currentUser}
        onOpenAuth={() => handleNavigate('portal')}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotification={handleClearNotification}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero
          onOpenBooking={() => handleNavigate('customer-booking')}
          onOpenAdmin={handleOpenAdmin}
          isAdmin={isAdminLoggedIn}
          onNavigate={handleNavigate}
          onOpenQR={() => setQrModalOpen(true)}
        />

        {/* 1. Dedicated Customer Booking Form with Direct Database Persistence */}
        <CustomerBookingForm
          onBookingSubmitted={(newBk) => {
            // Also add in-app notification for the booking
            const newNotif: AppNotification = {
              id: `notif-${Date.now()}`,
              title: 'Appointment Saved to Database',
              message: `${newBk.customerName} booked ${newBk.service} for ${newBk.appointmentDate} at ${newBk.appointmentTime}.`,
              type: 'info',
              timestamp: 'Just now',
              read: false,
              actionLabel: isAdminLoggedIn ? 'Open Admin Dashboard' : undefined,
              actionUrl: isAdminLoggedIn ? '#admin-dashboard' : undefined,
            };
            setNotifications((prev) => [newNotif, ...prev]);
          }}
          onShowToast={addToast}
        />

        {/* 2. Admin Dashboard - STRICTLY PROTECTED & HIDDEN from clients, only rendered when logged in as Admin */}
        {isAdminLoggedIn && (
          <div className="relative border-y-2 border-blue-500/20">
            <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex items-center justify-between font-semibold border-b border-blue-500/30">
              <div className="flex items-center gap-2 text-blue-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>AGENCY ADMIN SESSION ACTIVE</span>
                <span className="hidden sm:inline text-slate-400 font-normal">| Protected Internal Dashboard</span>
              </div>
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                title="Lock and hide Admin Dashboard"
              >
                Exit / Lock Admin Mode
              </button>
            </div>
            <AdminDashboard
              bookings={dbBookings}
              onShowToast={addToast}
              onRefresh={() => {
                const latest = getLocalBookings();
                setDbBookings(latest);
                addToast('info', 'Database Synced', 'Refreshed latest bookings from database.');
              }}
              onLogout={handleAdminLogout}
            />
          </div>
        )}

        <ServicesSection
          onSelectServiceForBooking={(serviceName) => {
            handleNavigate('customer-booking');
          }}
        />

        <FounderSection
          onOpenBooking={() => handleNavigate('customer-booking')}
          onShowToast={addToast}
        />

        <PortfolioSection
          onOpenBooking={() => handleNavigate('customer-booking')}
        />

        <ClientPortal
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          bookings={bookings}
          onOpenBooking={() => handleNavigate('customer-booking')}
          onShowToast={addToast}
        />

        <BlogSection />

        <ContactSection
          onOpenQR={() => setQrModalOpen(true)}
          onShowToast={addToast}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenQR={() => setQrModalOpen(true)}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            handleOpenAdmin();
          } else {
            setAdminLoginModalOpen(true);
          }
        }}
      />

      {/* Real-Time Live Customer Support Chat Widget */}
      <LiveChatWidget
        onOpenBooking={() => handleNavigate('customer-booking')}
        onNavigate={handleNavigate}
      />

      {/* Interactive QR Code & Business Card Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />

      {/* Agency Administrative Access Modal (Passcode Protected) */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        onShowToast={addToast}
      />

      {/* Non-Disruptive Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex items-center justify-around text-[10px] font-semibold">
        <a
          href={COMPANY_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <a
          href={COMPANY_INFO.telUrl}
          className="flex flex-col items-center gap-0.5 text-blue-600 dark:text-blue-400"
        >
          <Phone className="w-4 h-4" />
          <span>Call Us</span>
        </a>

        <button
          onClick={() => handleNavigate('customer-booking')}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl bg-blue-600 text-white font-bold"
        >
          <Calendar className="w-4 h-4" />
          <span>Book</span>
        </button>

        <button
          onClick={() => handleNavigate('admin-dashboard')}
          className="flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-300 font-semibold"
        >
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Admin</span>
        </button>

        <button
          onClick={() => handleNavigate('portal')}
          className="flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-300"
        >
          <Lock className="w-4 h-4" />
          <span>Vault</span>
        </button>

        <button
          onClick={() => setQrModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400"
        >
          <QrCode className="w-4 h-4" />
          <span>Card</span>
        </button>
      </div>
    </div>
  );
}
