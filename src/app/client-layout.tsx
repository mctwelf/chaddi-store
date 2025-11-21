'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BeautyAssistant from '@/components/BeautyAssistant'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <BeautyAssistant />
    </>
  )
}
