import React from 'react';
import { AppNotification } from '../types';
import { X, Bell, CheckCheck, Trash2 } from 'lucide-react';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
}) => {
  return (
    <div
      id="notifications-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6E9E5] shadow-2xl space-y-4 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#6FAF78]" />
            <h3 className="text-lg font-black text-[#26332A]">Smart Farm Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-mark-all-read"
              onClick={onMarkAllAsRead}
              className="text-xs text-[#56965F] font-bold hover:underline"
            >
              Mark all read
            </button>
            <button
              id="btn-close-notifications-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#F8F7EF] text-[#68736B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                n.priority === 'high'
                  ? 'bg-[#E88B8B]/15 border-[#E88B8B]'
                  : n.priority === 'medium'
                  ? 'bg-[#F4B66A]/20 border-[#F4B66A]'
                  : 'bg-[#9CCFE5]/20 border-[#9CCFE5]'
              }`}
            >
              <div className="flex items-center justify-between font-extrabold text-[#26332A]">
                <span>{n.title}</span>
                <span className="text-[10px] text-[#68736B] font-normal">{n.time}</span>
              </div>
              <p className="text-[#68736B] font-medium">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
