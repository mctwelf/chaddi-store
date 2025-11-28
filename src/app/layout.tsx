import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'شادي ستور - متجر شادي للجمال والعناية | Chaddi Store Beauty Shop',
  description: 'متجر شادي (Chaddi Store) - أفضل متجر جمال في موريتانيا. منتجات التجميل، العناية بالبشرة، العناية بالشعر، المكياج. Mauritania beauty shop in Nouakchott الدهين',
  keywords: [
    'شادي',
    'شادي ستور',
    'متجر شادي',
    'chaddi',
    'chaddistore',
    'chaddi store',
    'beauty',
    'متجر جمال',
    'الدهين',
    'موريتانيا',
    'نواكشوط',
    'Mauritania',
    'Nouakchott',
    'منتجات تجميل',
    'العناية بالبشرة',
    'العناية بالشعر',
    'مكياج',
    'cosmetics',
    'skincare',
    'makeup',
    'beauty products'
  ],
  authors: [{ name: 'Chaddi Store' }],
  creator: 'Chaddi Store',
  publisher: 'Chaddi Store',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_MR',
    alternateLocale: ['en_US', 'fr_FR'],
    url: 'https://chaddistore.vercel.app',
    siteName: 'شادي ستور - Chaddi Store',
    title: 'شادي ستور - متجر شادي للجمال والعناية | Chaddi Store',
    description: 'متجر شادي (Chaddi Store) - أفضل متجر جمال في موريتانيا. منتجات التجميل والعناية بالبشرة والشعر',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'شادي ستور - Chaddi Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شادي ستور - متجر شادي للجمال | Chaddi Store',
    description: 'متجر شادي - أفضل متجر جمال في موريتانيا',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://chaddistore.vercel.app',
  },
  category: 'Beauty & Cosmetics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
