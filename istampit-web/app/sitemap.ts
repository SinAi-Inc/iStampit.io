import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
      lastModified: now,
    },
    {
      url: `${SITE_URL}/stamp`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: now,
    },
    {
      url: `${SITE_URL}/verify`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified: now,
    },
    {
      url: `${SITE_URL}/ledger`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: now,
    },
  ];
}
