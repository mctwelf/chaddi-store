'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-black mb-12 text-center"><span className="gradient-text">تواصل معنا</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">نسعد بتواصلك معنا</h2>
            <p className="text-lg text-gray-600 mb-8">فريقنا جاهز للإجابة على جميع استفساراتك</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-xl"><Phone className="w-6 h-6 text-primary-600" /></div>
                <div><div className="font-bold mb-1">الهاتف</div><div className="text-gray-600">+222 12 34 56 78</div></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-xl"><Mail className="w-6 h-6 text-primary-600" /></div>
                <div><div className="font-bold mb-1">البريد الإلكتروني</div><div className="text-gray-600">info@chaddi.mr</div></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-xl"><MapPin className="w-6 h-6 text-primary-600" /></div>
                <div><div className="font-bold mb-1">العنوان</div><div className="text-gray-600">نواكشوط، موريتانيا</div></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">الاسم</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold mb-2">البريد الإلكتروني</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold mb-2">الرسالة</label>
                <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none" />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />إرسال الرسالة
              </button>
              {submitted && <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl text-green-700 text-center font-semibold">تم إرسال رسالتك بنجاح!</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
