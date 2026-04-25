import type { Metadata } from "next";

export const SITE_NAME = "kazuvin";
export const SITE_DESCRIPTION = "Thoughts, stories, and ideas about web development and technology";

// Production origin used for `metadataBase`, sitemap entries, robots.txt
// sitemap reference, and absolute canonical URL resolution.
// Change here when the site moves to a custom domain.
export const SITE_URL = "https://kazuvin.pages.dev";

// Single OG / Twitter image source. Generated at build time by
// `src/app/opengraph-image.tsx`; pages reference it via `pageMetadata` so the
// per-page `openGraph` override does not drop the cascading image set
// implicitly added by Next.js to the root layout.
const OG_IMAGE_URL = "/opengraph-image";

type PageMetadataInput = {
  /** Absolute URL path for canonical / og:url, e.g. "/blog/hello-world". */
  pathname: string;
  title: string;
  description: string;
  /** "article" for blog posts, "website" otherwise. */
  type?: "article" | "website";
};

export function pageMetadata({
  pathname,
  title,
  description,
  type = "website",
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: pathname,
      images: [OG_IMAGE_URL],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}
