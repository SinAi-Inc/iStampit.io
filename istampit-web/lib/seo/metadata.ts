import type { Metadata } from "next";
import { SITE, SITE_URL } from "./siteMetadata";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: "%s • iStampit.io",
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.author, url: SITE_URL }],
  creator: SITE.author,
  publisher: SITE.author,
  applicationName: SITE.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE_URL,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.ogImageAlt,
        type: "image/png",
      }
    ],
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        alt: SITE.ogImageAlt,
      }
    ],
  },
  icons: {
    icon: [
      { url: SITE.favicon, sizes: "64x64", type: "image/png" },
      { url: "/icons/appicon_512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: SITE.appleIcon, sizes: "180x180", type: "image/png" }
    ],
    shortcut: SITE.favicon,
  },
  manifest: SITE.manifest,
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  category: "technology",
  alternates: {
    canonical: SITE_URL,
  },
};
