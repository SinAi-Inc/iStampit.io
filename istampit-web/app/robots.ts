import type { MetadataRoute } from "next";
export const dynamic = 'force-static';
export const revalidate = 3600;
import { SITE_URL } from "../lib/seo/siteMetadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
