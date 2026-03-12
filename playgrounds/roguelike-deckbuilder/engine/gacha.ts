// ============================================================
// ガチャシステム
// TODO完了報酬やショップで使用
// ============================================================

import type { CardDefinition, GachaResult } from "./types";
import { cardRegistry } from "./card-registry";

/** レアリティごとの排出確率 */
const RARITY_WEIGHTS: Record<CardDefinition["rarity"], number> = {
  common: 55,
  uncommon: 30,
  rare: 12,
  legendary: 3,
};

/** ガチャを引く */
export function rollGacha(ownedCardDefIds: string[]): GachaResult {
  // 1. レアリティ抽選
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let selectedRarity: CardDefinition["rarity"] = "common";

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    roll -= weight;
    if (roll <= 0) {
      selectedRarity = rarity as CardDefinition["rarity"];
      break;
    }
  }

  // 2. そのレアリティのカードからランダム選出
  const candidates = cardRegistry.getCardsByRarity(selectedRarity);
  if (candidates.length === 0) {
    // フォールバック: 全カードから
    const allCards = cardRegistry.getAllCards();
    const card = allCards[Math.floor(Math.random() * allCards.length)];
    return {
      cardDefinitionId: card.id,
      isNew: !ownedCardDefIds.includes(card.id),
    };
  }

  const card = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    cardDefinitionId: card.id,
    isNew: !ownedCardDefIds.includes(card.id),
  };
}

/** 複数回ガチャを引く */
export function rollGachaMulti(count: number, ownedCardDefIds: string[]): GachaResult[] {
  const results: GachaResult[] = [];
  let currentOwned = [...ownedCardDefIds];
  for (let i = 0; i < count; i++) {
    const result = rollGacha(currentOwned);
    results.push(result);
    if (result.isNew) {
      currentOwned.push(result.cardDefinitionId);
    }
  }
  return results;
}
