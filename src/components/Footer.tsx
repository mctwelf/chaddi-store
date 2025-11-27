import Link from 'next/link'
import { Sparkles, Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export default function Footer() {
  const FACEBOOK_PAGE_URL = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || 'https://facebook.com/your-page'
  const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || 'your-page-id'
  
  return (
    <footer className="bg-gradient-to-br from-primary-900 to-primary-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 p-2 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">شادي</span>
            </div>
            <p className="text-primary-100 leading-relaxed">
              متجرك المفضل لأفضل منتجات التجميل والعناية بالبشرة والشعر
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-100 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-primary-100 hover:text-white transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-100 hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-100 hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-4">الفئات</h3>
            <ul className="space-y-2">
              <li className="text-primary-100">عناية بالبشرة</li>
              <li className="text-primary-100">عناية بالشعر</li>
              <li className="text-primary-100">أقنعة الوجه</li>
              <li className="text-primary-100">مجموعات خاصة</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-100">
                <Phone className="w-5 h-5" />
                <span>+222 12 34 56 78</span>
              </li>
              <li className="flex items-center gap-2 text-primary-100">
                <Mail className="w-5 h-5" />
                <span>info@chaddi.mr</span>
              </li>
              <li className="flex items-center gap-2 text-primary-100">
                <MapPin className="w-5 h-5" />
                <span>نواكشوط، موريتانيا</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a 
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                title="تابعنا على فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={`https://m.me/${FACEBOOK_PAGE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                title="راسلنا على Messenger"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-200">
          <p>© 2024 شادي. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-sm">
            <a 
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              تابعنا على فيسبوك للعروض الحصرية
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
