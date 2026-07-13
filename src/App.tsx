import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [config, setConfig] = useState<{
    productPrice: number;
    productOldPrice: number;
    fbPixelId: string;
    tiktokPixelId: string;
  } | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ productPrice: 2000, productOldPrice: 3500, fbPixelId: "", tiktokPixelId: "", ...docSnap.data() } as any);
      } else {
        setConfig({
          productPrice: 2000,
          productOldPrice: 3500,
          fbPixelId: "",
          tiktokPixelId: ""
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (config) {
      // Inject Facebook Pixel
      if (config.fbPixelId) {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        const fbPixels = config.fbPixelId.split(',').map(p => p.trim()).filter(Boolean);
        fbPixels.forEach(p => window.fbq('init', p));
        window.fbq('track', 'PageView');
      }

      // Inject TikTok Pixel
      if (config.tiktokPixelId) {
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          const ttPixels = config.tiktokPixelId.split(',').map(p => p.trim()).filter(Boolean);
          ttPixels.forEach(p => ttq.load(p));
          ttq.page();
        }(window, document, 'ttq');
      }
    }
  }, [config]);

  const handlePurchase = (price: number) => {
    if (config?.fbPixelId && window.fbq) {
      window.fbq('track', 'Purchase', { value: price, currency: 'DZD' });
    }
    if (config?.tiktokPixelId && window.ttq) {
      window.ttq.track('CompletePayment', { value: price, currency: 'DZD' });
    }
  };

  if (!config) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage productPrice={config.productPrice} productOldPrice={config.productOldPrice} onPurchase={handlePurchase} />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    TiktokAnalyticsObject: any;
    ttq: any;
  }
}
