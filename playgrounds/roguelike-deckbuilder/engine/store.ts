// ============================================================
// Zustand Game Store
// ゲーム全体の状態管理。コピペで移行可能。
// ============================================================

import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import type {
  BattleLogEntry,
  BattleState,
  CardInstance,
  GameState,
  GachaResult,
} from "./types";
import { cardRegistry } from "./card-registry";
import { initBattle, tickBattle, getDroppedCards } from "./battle-engine";
import { generateFloor } from "../data/floors";
import { rollGacha } from "./gacha";

// --------------- Store Actions ---------------

export interface GameActions {
  // デッキ管理
  addCardToOwned: (definitionId: string) => CardInstance;
  addToDeck: (instanceId: string) => void;
  removeFromDeck: (instanceId: string) => void;

  // バトル
  startBattle: () => void;
  tickBattle: (deltaMs: number) => BattleLogEntry[];
  endBattle: () => void;

  // タワー進行
  advanceFloor: () => void;

  // ガチャ
  pullGacha: () => GachaResult;

  // リセット
  resetGame: () => void;
}

export type GameStore = GameState & GameActions;

// --------------- Initial State ---------------

const initialBattleState: BattleState = {
  isActive: false,
  elapsedMs: 0,
  playerHp: 100,
  playerMaxHp: 100,
  enemies: [],
  cards: [],
  activeSynergies: [],
  log: [],
  result: "ongoing",
};

const initialGameState: GameState = {
  currentFloor: 1,
  highestFloor: 1,
  ownedCards: [],
  deck: [],
  maxDeckSize: 6,
  basePlayerHp: 100,
  gold: 0,
  battle: initialBattleState,
};

// --------------- Helpers ---------------

let instanceCounter = 0;
function generateInstanceId(): string {
  return `card_${Date.now()}_${++instanceCounter}`;
}

// --------------- Store Factory ---------------

export function createGameStore(initialState?: Partial<GameState>) {
  return createStore<GameStore>((set, get) => ({
    ...initialGameState,
    ...initialState,

    addCardToOwned: (definitionId: string) => {
      const instance: CardInstance = {
        instanceId: generateInstanceId(),
        definitionId,
        level: 1,
      };
      set((s) => ({ ownedCards: [...s.ownedCards, instance] }));
      return instance;
    },

    addToDeck: (instanceId: string) => {
      const state = get();
      if (state.deck.length >= state.maxDeckSize) return;
      if (state.deck.includes(instanceId)) return;
      if (!state.ownedCards.find((c) => c.instanceId === instanceId)) return;
      set((s) => ({ deck: [...s.deck, instanceId] }));
    },

    removeFromDeck: (instanceId: string) => {
      set((s) => ({ deck: s.deck.filter((id) => id !== instanceId) }));
    },

    startBattle: () => {
      const state = get();
      if (state.battle.isActive) return;

      const floor = generateFloor(state.currentFloor);
      const deckCards = state.ownedCards.filter((c) =>
        state.deck.includes(c.instanceId),
      );

      const enemies = floor.enemies.map((e) => ({
        ...e,
        remainingAttackCooldownMs: e.attackCooldownMs,
      }));

      const battleState = initBattle(deckCards, enemies, state.basePlayerHp);
      set({ battle: battleState });
    },

    tickBattle: (deltaMs: number) => {
      const state = get();
      if (!state.battle.isActive) return [];

      const prevEnemies = state.battle.enemies;
      const newBattle = tickBattle(state.battle, deltaMs);
      const tickLogs = newBattle.log;

      // ドロップチェック
      const drops = getDroppedCards(prevEnemies, newBattle.enemies);
      let updatedState: Partial<GameState> = {
        battle: { ...newBattle, log: [...state.battle.log, ...tickLogs] },
      };

      // ドロップカード追加
      for (const dropId of drops) {
        const instance: CardInstance = {
          instanceId: generateInstanceId(),
          definitionId: dropId,
          level: 1,
        };
        updatedState = {
          ...updatedState,
          ownedCards: [...(updatedState.ownedCards ?? state.ownedCards), instance],
        };
        const cardDef = cardRegistry.getCard(dropId);
        if (cardDef) {
          const dropLog: BattleLogEntry = {
            timestamp: newBattle.elapsedMs,
            message: `🎁 ${cardDef.icon} ${cardDef.name} をドロップ！`,
            type: "system",
          };
          (updatedState.battle as BattleState).log = [
            ...(updatedState.battle as BattleState).log,
            dropLog,
          ];
        }
      }

      set(updatedState);
      return tickLogs;
    },

    endBattle: () => {
      const state = get();
      if (state.battle.result === "victory") {
        const goldReward = 10 + state.currentFloor * 5;
        set((s) => ({
          gold: s.gold + goldReward,
          battle: { ...initialBattleState },
        }));
      } else {
        set({ battle: { ...initialBattleState } });
      }
    },

    advanceFloor: () => {
      set((s) => ({
        currentFloor: s.currentFloor + 1,
        highestFloor: Math.max(s.highestFloor, s.currentFloor + 1),
      }));
    },

    pullGacha: () => {
      const state = get();
      const ownedDefIds = state.ownedCards.map((c) => c.definitionId);
      const result = rollGacha(ownedDefIds);

      const instance: CardInstance = {
        instanceId: generateInstanceId(),
        definitionId: result.cardDefinitionId,
        level: 1,
      };

      set((s) => ({ ownedCards: [...s.ownedCards, instance] }));
      return result;
    },

    resetGame: () => {
      set({ ...initialGameState });
    },
  }));
}

// --------------- React Hook ---------------

// Vanilla store instance (lazy init)
let vanillaStore: ReturnType<typeof createGameStore> | null = null;

export function getVanillaStore() {
  if (!vanillaStore) {
    vanillaStore = createGameStore();
  }
  return vanillaStore;
}

/** React用フック（セレクタパターン） */
export function useGameStore<T>(selector: (state: GameStore) => T): T {
  return useStore(getVanillaStore(), selector);
}
