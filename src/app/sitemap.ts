import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const LAST_UPDATED = new Date("2026-11-06T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
