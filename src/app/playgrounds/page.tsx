import { PlaygroundsContainer, playgroundItems } from "@/features/playgrounds";

export const dynamic = "force-static";

export default function PlaygroundsPage() {
  return <PlaygroundsContainer items={playgroundItems} />;
}
