import { describe, it, expect, beforeAll } from "vitest";
import { createGameStore } from "../store";
import { cardRegistry } from "../card-registry";
import { STARTER_CARDS } from "../../data/cards";
import { SYNERGIES } from "../../data/synergies";

beforeAll(() => {
  for (const card of STARTER_CARDS) {
    if (!cardRegistry.getCard(card.id)) {
      cardRegistry.registerCard(card);
    }
  }
  for (const synergy of SYNERGIES) {
    if (!cardRegistry.getSynergy(synergy.id)) {
      cardRegistry.registerSynergy(synergy);
    }
  }
});

describe("Game Store", () => {
  it("should initialize with default state", () => {
    const store = createGameStore();
    const state = store.getState();
    expect(state.currentFloor).toBe(1);
    expect(state.ownedCards).toEqual([]);
    expect(state.deck).toEqual([]);
    expect(state.gold).toBe(0);
  });

  it("should add cards to owned", () => {
    const store = createGameStore();
    const instance = store.getState().addCardToOwned("fire_slash");
    expect(instance.definitionId).toBe("fire_slash");
    expect(store.getState().ownedCards).toHaveLength(1);
  });

  it("should manage deck", () => {
    const store = createGameStore();
    const inst = store.getState().addCardToOwned("fire_slash");

    store.getState().addToDeck(inst.instanceId);
    expect(store.getState().deck).toContain(inst.instanceId);

    store.getState().removeFromDeck(inst.instanceId);
    expect(store.getState().deck).not.toContain(inst.instanceId);
  });

  it("should not exceed max deck size", () => {
    const store = createGameStore({ maxDeckSize: 2 });
    const i1 = store.getState().addCardToOwned("fire_slash");
    const i2 = store.getState().addCardToOwned("ice_lance");
    const i3 = store.getState().addCardToOwned("heal_pulse");

    store.getState().addToDeck(i1.instanceId);
    store.getState().addToDeck(i2.instanceId);
    store.getState().addToDeck(i3.instanceId);

    expect(store.getState().deck).toHaveLength(2);
  });

  it("should start and run battle", () => {
    const store = createGameStore();
    const inst = store.getState().addCardToOwned("fire_slash");
    store.getState().addToDeck(inst.instanceId);

    store.getState().startBattle();
    expect(store.getState().battle.isActive).toBe(true);
  });

  it("should pull gacha and add card", () => {
    const store = createGameStore();
    const result = store.getState().pullGacha();
    expect(result.cardDefinitionId).toBeTruthy();
    expect(store.getState().ownedCards).toHaveLength(1);
  });

  it("should reset game", () => {
    const store = createGameStore();
    store.getState().addCardToOwned("fire_slash");
    store.getState().resetGame();
    expect(store.getState().ownedCards).toEqual([]);
    expect(store.getState().currentFloor).toBe(1);
  });
});
