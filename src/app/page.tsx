import type { Metadata } from "next";
import { KazuvinMark } from "@/components";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  pathname: "/",
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
});

export default function Home() {
  return (
    <section className="mb-16">
      <h1 className="mb-8 w-32">
        <KazuvinMark />
      </h1>
      <p className="text-foreground/80 text-lg leading-relaxed">
        Welcome to my blog! I&apos;m a passionate developer who loves building web applications and
        sharing knowledge with the community. This is a placeholder bio that can be customized with
        your personal story, background, and what drives your work.
      </p>
    </section>
  );
}
