import Link from "next/link";
import { Card, CardHeader } from "@/components/ui";
import type { PlaygroundItem } from "../types";

export type PlaygroundCardProps = {
  item: PlaygroundItem;
};

export function PlaygroundCard({ item }: PlaygroundCardProps) {
  return (
    <Link href={`/playgrounds/${item.slug}`} className="block">
      <Card className="ease h-full overflow-hidden transition-colors duration-200 hover:bg-stone-100">
        <CardHeader>
          <h2 className="font-semibold text-lg">{item.name}</h2>
          <p className="text-foreground/60 text-sm">{item.description}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
