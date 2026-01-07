'use client';

import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
      <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold">
        <span className="text-lg">✓</span>
        {message}
      </div>
    </div>
  );
}
