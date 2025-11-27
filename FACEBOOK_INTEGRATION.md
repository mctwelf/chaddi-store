# 📘 Facebook Integration Guide

## Overview
Connect your website to your Facebook page for better customer engagement and marketing.

---

## Step 1: Get Your Facebook Page URL

1. Go to your Facebook page
2. Copy the URL (e.g., `https://facebook.com/chaddibeauty`)
3. Add to `.env.local`:

```env
NEXT_PUBLIC_FACEBOOK_PAGE_URL=https://facebook.com/your-page-name
```

---

## Step 2: Get Your Facebook Page ID

### Method 1: From Page Settings
1. Go to your Facebook page
2. Click **Settings**
3. Click **Page Info**
4. Copy your **Page ID**

### Method 2: From URL
1. Go to: `https://findmyfbid.com/`
2. Paste your page URL
3. Copy the numeric ID

### Add to `.env.local`:
```env
NEXT_PUBLIC_FACEBOOK_PAGE_ID=123456789012345
```

---

## Step 3: Facebook Pixel (Optional - For Ads)

### Setup:
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a Pixel
3. Copy your Pixel ID
4. Add to `.env.local`:

```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
```

### Update `FacebookIntegration.tsx`:
Replace `YOUR_PIXEL_ID` with your actual Pixel ID or use environment variable:

```typescript
fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
```

---

## Step 4: Add Facebook Integration to Layout

Update `src/app/client-layout.tsx`:

```typescript
import FacebookIntegration from '@/components/FacebookIntegration'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FacebookIntegration />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

---

## Features Implemented

### 1. **Facebook Page Link** ✅
- Footer has Facebook icon
- Links to your Facebook page
- Opens in new tab

### 2. **Facebook Messenger** ✅
- Messenger icon in footer
- Direct link to chat with your page
- Format: `https://m.me/YOUR_PAGE_ID`

### 3. **Facebook Pixel** ✅
- Tracks page views
- Tracks conversions
- For Facebook Ads

---

## Facebook Messenger Chat Widget (Optional)

Add a floating chat button to your website:

### Create `src/components/MessengerChat.tsx`:

```typescript
'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function MessengerChat() {
  const [isOpen, setIsOpen] = useState(false)
  const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || ''

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-bold">تواصل معنا</h3>
            <p className="text-sm text-blue-100">نرد عليك في أسرع وقت</p>
          </div>
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || '')}&tabs=messages&width=320&height=320&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
            width="320"
            height="320"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allow="encrypted-media"
          ></iframe>
        </div>
      )}
    </>
  )
}
```

### Add to layout:
```typescript
import MessengerChat from '@/components/MessengerChat'

// In your layout
<MessengerChat />
```

---

## Facebook Shop Integration (Advanced)

### Connect Your Products to Facebook:

1. **Create Facebook Shop:**
   - Go to your Facebook page
   - Click **Shop**
   - Set up your shop

2. **Sync Products:**
   - Use Facebook Catalog
   - Upload product feed
   - Format: CSV or XML

3. **Product Feed URL:**
   Create `/api/facebook-feed/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`)
  const products = await res.json()
  
  // Convert to Facebook format
  const feed = products.map((p: any) => ({
    id: p.id,
    title: p.name,
    description: p.description,
    availability: p.inStock ? 'in stock' : 'out of stock',
    condition: 'new',
    price: `${p.price} MRU`,
    link: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${p.id}`,
    image_link: p.image,
    brand: 'شادي'
  }))
  
  return NextResponse.json(feed)
}
```

---

## Testing

### Test Facebook Links:
1. Click Facebook icon in footer
2. Should open your Facebook page
3. Click Messenger icon
4. Should open Messenger chat

### Test Pixel:
1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/) Chrome extension
2. Visit your website
3. Check if pixel is firing

---

## Environment Variables Summary

Add to `.env.local`:

```env
# Facebook Integration
NEXT_PUBLIC_FACEBOOK_PAGE_URL=https://facebook.com/your-page-name
NEXT_PUBLIC_FACEBOOK_PAGE_ID=123456789012345
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id

# Your website URL (for Facebook Shop)
NEXT_PUBLIC_BASE_URL=https://your-website.com
```

Add to Vercel:
- Same variables in Vercel dashboard
- Settings → Environment Variables

---

## Benefits

✅ **Direct Communication:** Customers can message you on Facebook
✅ **Social Proof:** Show your Facebook presence
✅ **Marketing:** Track conversions with Pixel
✅ **Shop Integration:** Sell directly on Facebook
✅ **Customer Trust:** Link to your verified page

---

## Next Steps

1. ✅ Add Facebook page URL to `.env.local`
2. ✅ Add Facebook page ID to `.env.local`
3. ✅ Test links in footer
4. ⏳ Optional: Set up Facebook Pixel
5. ⏳ Optional: Add Messenger chat widget
6. ⏳ Optional: Create Facebook Shop

**Your website is now connected to Facebook!** 📘✨
