import type { PlaygroundItem } from "../types";
import { PlaygroundCard } from "./playground-card";

export type PlaygroundGridProps = {
  items: PlaygroundItem[];
};

export function PlaygroundGrid({ items }: PlaygroundGridProps) {
  if (items.length === 0) {
    return <p className="text-foreground/60">No playgrounds yet. Add items to get started.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <PlaygroundCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
