// ============================================================
// Valibot schemas for runtime validation
// ============================================================

import * as v from "valibot";

// --------------- Card System ---------------

export const ActivationTimingSchema = v.picklist(["on_battle_start", "cooldown"]);

export const CardEffectSchema = v.object({
  type: v.string(),
  value: v.number(),
  target: v.picklist(["enemy", "self", "all_enemies"]),
  params: v.optional(v.record(v.string(), v.unknown())),
});

export const CardDefinitionSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  tags: v.array(v.string()),
  rarity: v.picklist(["common", "uncommon", "rare", "legendary"]),
  timing: ActivationTimingSchema,
  cooldownSec: v.pipe(v.number(), v.minValue(0)),
  effects: v.pipe(v.array(CardEffectSchema), v.minLength(1)),
  icon: v.string(),
});

export const CardInstanceSchema = v.object({
  instanceId: v.pipe(v.string(), v.minLength(1)),
  definitionId: v.pipe(v.string(), v.minLength(1)),
  level: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

// --------------- Synergy ---------------

export const SynergyConditionSchema = v.object({
  tag: v.string(),
  minCount: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

export const SynergyBonusSchema = v.object({
  type: v.string(),
  value: v.number(),
  targetTag: v.optional(v.string()),
});

export const SynergyDefinitionSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.string(),
  description: v.string(),
  conditions: v.pipe(v.array(SynergyConditionSchema), v.minLength(1)),
  bonuses: v.pipe(v.array(SynergyBonusSchema), v.minLength(1)),
});

// --------------- Floor ---------------

export const EnemyBaseSchema = v.object({
  id: v.string(),
  name: v.string(),
  maxHp: v.pipe(v.number(), v.minValue(1)),
  currentHp: v.number(),
  attack: v.pipe(v.number(), v.minValue(0)),
  attackCooldownMs: v.pipe(v.number(), v.minValue(100)),
  dropCardId: v.nullable(v.string()),
  icon: v.string(),
});

export const FloorDefinitionSchema = v.object({
  floorNumber: v.pipe(v.number(), v.integer(), v.minValue(1)),
  enemies: v.pipe(v.array(EnemyBaseSchema), v.minLength(1)),
});

// --------------- Validation helpers ---------------

export function validateCardDefinition(data: unknown) {
  return v.safeParse(CardDefinitionSchema, data);
}

export function validateSynergyDefinition(data: unknown) {
  return v.safeParse(SynergyDefinitionSchema, data);
}

export function validateFloorDefinition(data: unknown) {
  return v.safeParse(FloorDefinitionSchema, data);
}
