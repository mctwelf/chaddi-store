'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md animate-slide-down ${
              toast.type === 'success'
                ? 'bg-green-500/95 text-white'
                : toast.type === 'error'
                ? 'bg-red-500/95 text-white'
                : 'bg-blue-500/95 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-6 h-6" />}
            {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
            {toast.type === 'info' && <Info className="w-6 h-6" />}
            <span className="font-semibold text-lg">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
