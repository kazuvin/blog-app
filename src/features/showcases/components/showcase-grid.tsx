import type { ShowcaseItem } from "../types";
import { ShowcaseCard } from "./showcase-card";

export type ShowcaseGridProps = {
  items: ShowcaseItem[];
  onItemClick: (item: ShowcaseItem) => void;
};

export function ShowcaseGrid({ items, onItemClick }: ShowcaseGridProps) {
  return (
    <div className="grid gap-6">
      {items.map((item) => (
        <ShowcaseCard
          key={item.id}
          name={item.name}
          description={item.description}
          preview={item.preview}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
