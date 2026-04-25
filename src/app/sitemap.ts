import type { MetadataRoute } from "next";
import { getSortedPostsData } from "@/features/blog";
import { playgroundItems } from "@/features/playgrounds";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/blog`, lastModified: now },
    { url: `${SITE_URL}/showcases`, lastModified: now },
    { url: `${SITE_URL}/playgrounds`, lastModified: now },
  ];

  const blogPosts: MetadataRoute.Sitemap = getSortedPostsData().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const playgrounds: MetadataRoute.Sitemap = playgroundItems.map((item) => ({
    url: `${SITE_URL}/playgrounds/${item.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...blogPosts, ...playgrounds];
}
