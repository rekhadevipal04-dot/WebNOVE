import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  X,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

// Valid authorized administrative passcodes
const VALID_PASSCODES = [
  '9519',        // Agency phone sequence
  'admin123',    // Standard agency admin
  'webnova2026', // Brand passcode
  '7678',        // User account identifier
  'rekha04',     // Leadership identifier
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = passcode.trim().toLowerCase();

    if (!cleanInput) {
      setError('Please enter the administrative passcode or PIN.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (VALID_PASSCODES.includes(cleanInput)) {
        localStorage.setItem('webnova_admin_auth', 'true');
        onLoginSuccess();
        onShowToast(
          'success',
          'Admin Access Granted',
          'Welcome to the WEBNOVA Appointment Management & Control Dashboard.'
        );
        onClose();
        setPasscode('');
      } else {
        setError('Incorrect administrative passcode. Access denied.');
        onShowToast('error', 'Authentication Failed', 'Invalid administrative passcode.');
      }
    }, 400);
  };

  const handleQuickPin = (pin: string) => {
    setPasscode(pin);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-wider text-blue-400 uppercase font-semibold">
                  Restricted Access
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-white">
                Agency Admin Authentication
              </h3>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            This management dashboard is private and strictly restricted to WEBNOVA agency administrators and leadership.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Admin Passcode / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter PIN (e.g. 9519 or admin123)"
                autoFocus
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono text-slate-900 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Authorized agency staff only</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">PIN Hint: 9519 or admin123</span>
            </div>
          </div>

          {/* Quick PIN Presets for One-Click Team Login */}
          <div className="pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Admin Presets:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPin('9519')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="block font-bold text-[11px] text-blue-600 dark:text-blue-400">PIN: 9519</span>
                <span className="text-[10px] text-slate-500">Agency Phone PIN</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPin('admin123')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-left text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="block font-bold text-[11px] text-blue-600 dark:text-blue-400">PIN: admin123</span>
                <span className="text-[10px] text-slate-500">Leadership Standard</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
