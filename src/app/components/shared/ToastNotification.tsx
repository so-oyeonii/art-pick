import { Check } from 'lucide-react'
import type { ToastNotification as ToastType } from '@/lib/types'

interface ToastNotificationProps {
  notification: ToastType
}

export default function ToastNotification({ notification }: ToastNotificationProps) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-3 max-w-sm">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Check className="text-white" size={20} />
        </div>
        <div>
          <div className="font-bold text-neutral-900">{notification.title}</div>
          <div className="text-sm text-neutral-600">{notification.msg}</div>
        </div>
      </div>
    </div>
  )
}
