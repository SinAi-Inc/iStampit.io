import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo/siteMetadata";

export const dynamic = 'force-static';
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0, lastModified: now },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.3, lastModified: now },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.3, lastModified: now },
  ];
  // Only advertise /stamp when not a static marketing export
  if (process.env.NEXT_PUBLIC_PAGES_STATIC !== '1') {
    entries.push({ url: `${SITE_URL}/stamp`, changeFrequency: "weekly", priority: 0.9, lastModified: now });
  }
  entries.push(
    { url: `${SITE_URL}/verify`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/ledger`, changeFrequency: "daily", priority: 0.8, lastModified: now }
  );

  // Add static monthly ledger index pages if they exist (we know pattern /ledger/YYYY/MM/)
  const year = new Date().getFullYear();
  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, '0');
    entries.push({ url: `${SITE_URL}/ledger/${year}/${mm}/`, changeFrequency: 'daily', priority: 0.2, lastModified: now });
  }
  return entries;
}
