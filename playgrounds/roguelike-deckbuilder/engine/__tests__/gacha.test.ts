import { describe, it, expect, beforeAll } from "vitest";
import { cardRegistry } from "../card-registry";
import { rollGacha, rollGachaMulti } from "../gacha";
import { STARTER_CARDS } from "../../data/cards";

beforeAll(() => {
  // Register cards if not already done
  for (const card of STARTER_CARDS) {
    if (!cardRegistry.getCard(card.id)) {
      cardRegistry.registerCard(card);
    }
  }
});

describe("Gacha System", () => {
  it("should return a valid card definition id", () => {
    const result = rollGacha([]);
    expect(cardRegistry.getCard(result.cardDefinitionId)).toBeDefined();
  });

  it("should mark new cards as isNew", () => {
    const result = rollGacha([]);
    expect(result.isNew).toBe(true);
  });

  it("should mark duplicates correctly", () => {
    const allIds = STARTER_CARDS.map((c) => c.id);
    const result = rollGacha(allIds);
    expect(result.isNew).toBe(false);
  });

  it("should roll multiple times", () => {
    const results = rollGachaMulti(5, []);
    expect(results).toHaveLength(5);
    for (const r of results) {
      expect(cardRegistry.getCard(r.cardDefinitionId)).toBeDefined();
    }
  });
});
