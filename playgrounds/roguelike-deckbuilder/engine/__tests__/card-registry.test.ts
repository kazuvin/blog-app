import { describe, it, expect, beforeEach } from "vitest";
import { cardRegistry } from "../card-registry";
import type { CardDefinition, SynergyDefinition } from "../types";

// テスト用にレジストリをリセットする代わりに一意IDを使う
const prefix = `test_${Date.now()}_`;

function makeCard(overrides: Partial<CardDefinition> = {}): CardDefinition {
  const id = `${prefix}card_${Math.random().toString(36).slice(2)}`;
  return {
    id,
    name: "Test Card",
    description: "test",
    tags: ["fire", "attack"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 3,
    effects: [{ type: "damage", value: 10, target: "enemy" }],
    icon: "🔥",
    ...overrides,
  };
}

describe("CardRegistry", () => {
  it("should register and retrieve a card", () => {
    const card = makeCard();
    cardRegistry.registerCard(card);
    expect(cardRegistry.getCard(card.id)).toEqual(card);
  });

  it("should reject invalid card definitions", () => {
    expect(() =>
      cardRegistry.registerCard({ id: "", name: "bad" } as CardDefinition),
    ).toThrow();
  });

  it("should filter cards by tag", () => {
    const c1 = makeCard({ tags: ["ice", "attack"] });
    const c2 = makeCard({ tags: ["fire", "attack"] });
    cardRegistry.registerCards([c1, c2]);

    const iceCards = cardRegistry.getCardsByTag("ice");
    expect(iceCards.some((c) => c.id === c1.id)).toBe(true);
    expect(iceCards.some((c) => c.id === c2.id)).toBe(false);
  });

  it("should filter cards by rarity", () => {
    const c1 = makeCard({ rarity: "legendary" });
    cardRegistry.registerCard(c1);

    const legendaries = cardRegistry.getCardsByRarity("legendary");
    expect(legendaries.some((c) => c.id === c1.id)).toBe(true);
  });

  it("should evaluate synergies based on tag counts", () => {
    const c1 = makeCard({ tags: ["testSynTag"] });
    const c2 = makeCard({ tags: ["testSynTag"] });
    const c3 = makeCard({ tags: ["testSynTag"] });
    cardRegistry.registerCards([c1, c2, c3]);

    const synergy: SynergyDefinition = {
      id: `${prefix}syn1`,
      name: "Test Synergy",
      description: "test",
      conditions: [{ tag: "testSynTag", minCount: 3 }],
      bonuses: [{ type: "damage_multiply", value: 1.5 }],
    };
    cardRegistry.registerSynergy(synergy);

    const active = cardRegistry.evaluateSynergies([c1.id, c2.id, c3.id]);
    expect(active.some((s) => s.id === synergy.id)).toBe(true);

    // 2枚では発動しない
    const inactive = cardRegistry.evaluateSynergies([c1.id, c2.id]);
    expect(inactive.some((s) => s.id === synergy.id)).toBe(false);
  });
});
