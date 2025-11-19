import { Sparkles, Heart, Award, Users } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-black mb-6">
            <span className="gradient-text">من نحن</span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            متجر شادي هو وجهتك المفضلة لأفضل منتجات التجميل والعناية بالبشرة والشعر
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">قصتنا</h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>بدأت رحلتنا من شغف حقيقي بعالم الجمال والعناية الشخصية.</p>
                <p>نحن نؤمن بأن كل امرأة تستحق أن تشعر بالجمال والثقة.</p>
                <p>اليوم، نفخر بخدمة آلاف العملاء السعداء في جميع أنحاء موريتانيا.</p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80" alt="About" className="rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black mb-12 text-center"><span className="gradient-text">قيمنا</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-primary-50 shadow-lg">
              <Award className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">الجودة</h3>
              <p className="text-gray-600">منتجات أصلية 100%</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-accent-50 shadow-lg">
              <Heart className="w-16 h-16 text-accent-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">الثقة</h3>
              <p className="text-gray-600">رضا العملاء أولويتنا</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-primary-50 shadow-lg">
              <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">التميز</h3>
              <p className="text-gray-600">أفضل الأسعار والعروض</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-accent-50 shadow-lg">
              <Users className="w-16 h-16 text-accent-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">المجتمع</h3>
              <p className="text-gray-600">نبني علاقات طويلة الأمد</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">ابدئي رحلتك معنا</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">انضمي لآلاف العملاء السعداء واكتشفي جمالك الحقيقي</p>
          <Link href="/products" className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all inline-block">
            تسوقي الآن
          </Link>
        </div>
      </section>
    </div>
  )
}
