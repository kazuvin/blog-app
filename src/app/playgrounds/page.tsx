import type { Metadata } from "next";
import { PlaygroundsContainer, playgroundItems } from "@/features/playgrounds";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  pathname: "/playgrounds",
  title: "Playgrounds",
  description: "Interactive demos and experiments.",
});

export default function PlaygroundsPage() {
  return <PlaygroundsContainer items={playgroundItems} />;
}
