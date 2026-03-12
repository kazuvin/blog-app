"use client";

import dynamic from "next/dynamic";

const RoguelikeGame = dynamic(
  () => import("../../../../playgrounds/roguelike-deckbuilder/ui/roguelike-game"),
  { ssr: false }
);

export default RoguelikeGame;
