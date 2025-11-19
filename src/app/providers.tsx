'use client'

import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import { ThemeProvider } from '@/context/ThemeContext'
import ClientLayout from './client-layout'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
