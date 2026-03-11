import dynamic from "next/dynamic";
import type { PlaygroundItem } from "../types";

const RoguelikeGame = dynamic(
  () => import("../../../../playgrounds/roguelike-deckbuilder/ui/roguelike-game"),
  { ssr: false }
);

export const playgroundItems: PlaygroundItem[] = [
  {
    slug: "roguelike-deckbuilder",
    name: "Roguelike Deck Builder",
    description:
      "無限タワー型デッキ構築ローグライク。クールダウン制カードが並列発動し、シナジーを組んで攻略する。",
    component: RoguelikeGame,
  },
];
