import type { PlaygroundItem } from "../types";
import { PlaygroundGrid } from "./playground-grid";

export type PlaygroundsContainerProps = {
  items: PlaygroundItem[];
};

export function PlaygroundsContainer({ items }: PlaygroundsContainerProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-foreground">Playgrounds</h1>
        <p className="text-foreground/70">
          A space for trying out technologies and previewing modular features.
        </p>
      </div>
      <PlaygroundGrid items={items} />
    </>
  );
}
