"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID } from "../lib/analytics";

/** Track a page view (used on route changes) */
export function pageview(url: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  (window as any).gtag?.("config", GA_MEASUREMENT_ID, { page_path: url });
}

/** Fire a custom GA event anywhere in the app */
export function gaEvent(params: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  const { action, ...rest } = params;
  (window as any).gtag?.("event", action, rest);
}

/**
 * GoogleTag component
 * - Tracks page views on App Router navigations
 *
 * Usage:
 *   import GoogleTag from "@/components/GoogleTag";
 *   // In app/layout.tsx inside <body>:
 *   <GoogleTag />
 */
export default function GoogleTag() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  // Track client-side navigations
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) return;
    const qs = searchParams ? searchParams.toString() : '';
    const url = qs ? `${pathname}?${qs}` : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
