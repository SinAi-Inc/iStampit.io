export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const SITE = {
  name: "iStampit.io",
  title: "iStampit.io — Digital Watermarking & Timestamp Verification",
  description:
    "Secure your digital content with advanced watermarking technology. Instant verification, Bitcoin-secured timestamps, and privacy-first proof of existence for creators and innovators.",
  keywords: [
    "digital watermarking",
    "timestamp verification",
    "blockchain proof",
    "bitcoin timestamps",
    "content protection",
    "copyright protection",
    "digital security",
    "opentimestamps",
    "proof of existence",
    "intellectual property protection"
  ],
  author: "SinAI Inc",
  twitter: "@istampit",
  linkedin: "company/sinai-inc",
  github: "SinAi-Inc/iStampit.io",
  ogImage: "/social/og-banner.png",
  ogImageAlt: "iStampit.io - Digital Watermarking & Timestamp Verification Platform",
  favicon: "/icons/favicon_64.png",
  appleIcon: "/icons/appicon_180.png",
  manifest: "/site.webmanifest",
  themeColor: {
    light: "#f8fafc",
    dark: "#020617"
  },
  lang: "en",
  locale: "en_US",
  brandColors: {
    primary: "#3b82f6",
    secondary: "#1e293b",
    accent: "#06b6d4"
  }
};
