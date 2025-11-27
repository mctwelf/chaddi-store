'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function FacebookIntegration() {
  useEffect(() => {
    // Initialize Facebook SDK
    if (typeof window !== 'undefined') {
      (window as any).fbAsyncInit = function() {
        (window as any).FB.init({
          xfbml: true,
          version: 'v18.0'
        })
      }
    }
  }, [])

  return (
    <>
      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID'); // Replace with your Pixel ID
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Facebook SDK for Messenger */}
      <Script
        id="facebook-sdk"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://connect.facebook.net/ar_AR/sdk.js"
      />

      {/* Facebook Page Plugin (Hidden by default, can be shown in footer) */}
      <div id="fb-root"></div>
    </>
  )
}
