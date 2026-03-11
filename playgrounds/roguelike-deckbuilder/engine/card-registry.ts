// ============================================================
// Card & Synergy Registry
// 新しいカード種別やシナジーを追加するだけで無限にスケール可能
// ============================================================

import type { CardDefinition, SynergyDefinition } from "./types";
import { validateCardDefinition, validateSynergyDefinition } from "./schemas";

class CardRegistry {
  private cards = new Map<string, CardDefinition>();
  private synergies = new Map<string, SynergyDefinition>();

  registerCard(card: CardDefinition): void {
    const result = validateCardDefinition(card);
    if (!result.success) {
      throw new Error(`Invalid card definition "${card.id}": ${JSON.stringify(result.issues)}`);
    }
    this.cards.set(card.id, card);
  }

  registerCards(cards: CardDefinition[]): void {
    for (const card of cards) {
      this.registerCard(card);
    }
  }

  registerSynergy(synergy: SynergyDefinition): void {
    const result = validateSynergyDefinition(synergy);
    if (!result.success) {
      throw new Error(`Invalid synergy definition "${synergy.id}": ${JSON.stringify(result.issues)}`);
    }
    this.synergies.set(synergy.id, synergy);
  }

  registerSynergies(synergies: SynergyDefinition[]): void {
    for (const synergy of synergies) {
      this.registerSynergy(synergy);
    }
  }

  getCard(id: string): CardDefinition | undefined {
    return this.cards.get(id);
  }

  getSynergy(id: string): SynergyDefinition | undefined {
    return this.synergies.get(id);
  }

  getAllCards(): CardDefinition[] {
    return Array.from(this.cards.values());
  }

  getAllSynergies(): SynergyDefinition[] {
    return Array.from(this.synergies.values());
  }

  getCardsByTag(tag: string): CardDefinition[] {
    return this.getAllCards().filter((c) => c.tags.includes(tag));
  }

  getCardsByRarity(rarity: CardDefinition["rarity"]): CardDefinition[] {
    return this.getAllCards().filter((c) => c.rarity === rarity);
  }

  /** デッキ内のタグを集計し、発動中のシナジーを返す */
  evaluateSynergies(cardDefinitionIds: string[]): SynergyDefinition[] {
    const tagCounts = new Map<string, number>();
    for (const id of cardDefinitionIds) {
      const card = this.cards.get(id);
      if (!card) continue;
      for (const tag of card.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return this.getAllSynergies().filter((synergy) =>
      synergy.conditions.every((cond) => (tagCounts.get(cond.tag) ?? 0) >= cond.minCount),
    );
  }
}

// シングルトンインスタンス
export const cardRegistry = new CardRegistry();
