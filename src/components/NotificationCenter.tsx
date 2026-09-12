import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, ExternalLink, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { AppNotification } from '../types/index.ts';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onNavigate: (sectionId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleActionClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.actionUrl) {
      const target = notif.actionUrl.replace('#', '');
      onNavigate(target);
      setIsOpen(false);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'urgent':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-3.5 top-16 sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-96 max-w-md mx-auto sm:mx-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh] sm:max-h-[32rem]">
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-1.5 gap-1.5 flex-shrink-0">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs">No notifications to display</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 transition-colors relative group ${
                      !notif.read
                        ? 'bg-blue-50/40 dark:bg-blue-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed break-words">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 gap-2">
                          {notif.actionLabel ? (
                            <button
                              onClick={() => handleActionClick(notif)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <span>{notif.actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : <span />}

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notif.read && (
                              <button
                                onClick={() => onMarkAsRead(notif.id)}
                                className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => onClear(notif.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                              title="Delete notification"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-center flex-shrink-0">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Automated WEBNOVA Task &amp; Event Dispatcher
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
