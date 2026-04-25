import type { Metadata } from "next";
import { ShowcasesContainer, showcaseItems } from "@/features/showcases";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  pathname: "/showcases",
  title: "Showcases",
  description: "Selected projects and case studies.",
});

export default function ShowcasesPage() {
  return <ShowcasesContainer items={showcaseItems} />;
}
