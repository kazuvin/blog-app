// ============================================================
// Public API - コピペ移行時はこのファイルからインポート
// ============================================================

// Types
export type {
  CardDefinition,
  CardEffect,
  CardInstance,
  ActivationTiming,
  EffectType,
  SynergyDefinition,
  SynergyCondition,
  SynergyBonus,
  BattleState,
  BattleCard,
  BattleLogEntry,
  Enemy,
  FloorDefinition,
  GachaResult,
  GameState,
} from "./types";

// Registry
export { cardRegistry } from "./card-registry";

// Battle Engine
export { initBattle, tickBattle, getDroppedCards, registerEffectHandler } from "./battle-engine";

// Gacha
export { rollGacha, rollGachaMulti } from "./gacha";

// Store
export { createGameStore, useGameStore, getVanillaStore } from "./store";
export type { GameActions, GameStore } from "./store";

// Schemas
export {
  CardDefinitionSchema,
  CardInstanceSchema,
  SynergyDefinitionSchema,
  FloorDefinitionSchema,
  validateCardDefinition,
  validateSynergyDefinition,
  validateFloorDefinition,
} from "./schemas";
