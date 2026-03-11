import RoguelikeGame from "../components/roguelike-game-loader";
import type { PlaygroundItem } from "../types";

export const playgroundItems: PlaygroundItem[] = [
  {
    slug: "roguelike-deckbuilder",
    name: "Roguelike Deck Builder",
    description:
      "無限タワー型デッキ構築ローグライク。クールダウン制カードが並列発動し、シナジーを組んで攻略する。",
    component: RoguelikeGame,
  },
];
