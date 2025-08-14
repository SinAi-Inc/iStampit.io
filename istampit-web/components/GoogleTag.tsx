"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/** GA4 Measurement ID (e.g., G-XXXXXXXXXX) */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

/** Track a page view (used on route changes) */
export function pageview(url: string) {
  if (!GA_ID || typeof window === "undefined") return;
  (window as any).gtag?.("config", GA_ID, { page_path: url });
}

/** Fire a custom GA event anywhere in the app */
export function gaEvent(params: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}) {
  if (!GA_ID || typeof window === "undefined") return;
  const { action, ...rest } = params;
  (window as any).gtag?.("event", action, rest);
}

/**
 * GoogleTag component
 * - Loads gtag.js only in production and when GA_ID is set
 * - Tracks page views on App Router navigations
 * - Includes a Consent Mode default (ads denied; analytics granted)
 *
 * Usage:
 *   import GoogleTag from "@/components/GoogleTag";
 *   // In app/layout.tsx inside <body>:
 *   <GoogleTag />
 */
export default function GoogleTag() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();

  // Track client-side navigations
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !GA_ID) return;
  const qs = searchParams ? searchParams.toString() : '';
  const url = qs ? `${pathname}?${qs}` : pathname;
  pageview(url);
  }, [pathname, searchParams]);

  // Don’t inject scripts in dev or without an ID
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      {/* Consent Mode: default to analytics allowed, ads denied. Tie to your consent UI as needed. */}
      <Script id="consent-default" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'granted'
          });`}
      </Script>

      {/* gtag.js loader */}
      <Script
        id="gtag-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      {/* GA config */}
      <Script id="gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: true,
            page_path: window.location.pathname
          });
        `}
      </Script>
    </>
  );
}
