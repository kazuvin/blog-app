// ============================================================
// Battle Engine
// 時間経過でクールダウン付きカードが並列発動するコアロジック
// Framework-agnostic: 純粋関数として実装
// ============================================================

import type {
  BattleCard,
  BattleLogEntry,
  BattleState,
  CardDefinition,
  CardInstance,
  Enemy,
  SynergyBonus,
  SynergyDefinition,
} from "./types";
import { cardRegistry } from "./card-registry";

// --------------- Effect Handlers ---------------

/** 効果ハンドラのインターフェース（無限に拡張可能） */
export type EffectHandler = (params: {
  effectType: string;
  effectValue: number;
  effectTarget: "enemy" | "self" | "all_enemies";
  effectParams?: Record<string, unknown>;
  cardDef: CardDefinition;
  cardLevel: number;
  state: BattleState;
  synergies: SynergyDefinition[];
}) => { state: BattleState; logs: BattleLogEntry[] };

const effectHandlers = new Map<string, EffectHandler>();

/** 効果ハンドラを登録（外部から新しい効果タイプを追加可能） */
export function registerEffectHandler(type: string, handler: EffectHandler): void {
  effectHandlers.set(type, handler);
}

// --------------- Synergy Bonus Helpers ---------------

function getDamageMultiplier(synergies: SynergyDefinition[], cardDef: CardDefinition): number {
  let multiplier = 1;
  for (const synergy of synergies) {
    for (const bonus of synergy.bonuses) {
      if (bonus.type === "damage_multiply") {
        if (!bonus.targetTag || cardDef.tags.includes(bonus.targetTag)) {
          multiplier *= bonus.value;
        }
      }
    }
  }
  return multiplier;
}

function getHealMultiplier(synergies: SynergyDefinition[]): number {
  let multiplier = 1;
  for (const synergy of synergies) {
    for (const bonus of synergy.bonuses) {
      if (bonus.type === "heal_multiply") {
        multiplier *= bonus.value;
      }
    }
  }
  return multiplier;
}

function getCooldownMultiplier(synergies: SynergyDefinition[], cardDef: CardDefinition): number {
  let multiplier = 1;
  for (const synergy of synergies) {
    for (const bonus of synergy.bonuses) {
      if (bonus.type === "cooldown_reduce") {
        if (!bonus.targetTag || cardDef.tags.includes(bonus.targetTag)) {
          multiplier *= bonus.value;
        }
      }
    }
  }
  return multiplier;
}

// --------------- Built-in Effect Handlers ---------------

function createLog(message: string, type: BattleLogEntry["type"], elapsed: number): BattleLogEntry {
  return { timestamp: elapsed, message, type };
}

registerEffectHandler("damage", ({ effectValue, effectTarget, cardDef, cardLevel, state, synergies }) => {
  const logs: BattleLogEntry[] = [];
  const baseDamage = Math.floor(effectValue * (1 + (cardLevel - 1) * 0.2));
  const multiplier = getDamageMultiplier(synergies, cardDef);
  const finalDamage = Math.floor(baseDamage * multiplier);

  const newEnemies = [...state.enemies];

  if (effectTarget === "enemy") {
    // 最初の生存敵を攻撃
    const targetIdx = newEnemies.findIndex((e) => e.currentHp > 0);
    if (targetIdx >= 0) {
      newEnemies[targetIdx] = {
        ...newEnemies[targetIdx],
        currentHp: Math.max(0, newEnemies[targetIdx].currentHp - finalDamage),
      };
      logs.push(createLog(`${cardDef.icon} ${cardDef.name} → ${newEnemies[targetIdx].name} に ${finalDamage} ダメージ`, "damage", state.elapsedMs));
    }
  } else if (effectTarget === "all_enemies") {
    for (let i = 0; i < newEnemies.length; i++) {
      if (newEnemies[i].currentHp > 0) {
        newEnemies[i] = {
          ...newEnemies[i],
          currentHp: Math.max(0, newEnemies[i].currentHp - finalDamage),
        };
        logs.push(createLog(`${cardDef.icon} ${cardDef.name} → ${newEnemies[i].name} に ${finalDamage} ダメージ`, "damage", state.elapsedMs));
      }
    }
  }

  return { state: { ...state, enemies: newEnemies }, logs };
});

registerEffectHandler("heal", ({ effectValue, cardDef, cardLevel, state, synergies }) => {
  const baseHeal = Math.floor(effectValue * (1 + (cardLevel - 1) * 0.15));
  const multiplier = getHealMultiplier(synergies);
  const finalHeal = Math.floor(baseHeal * multiplier);
  const newHp = Math.min(state.playerMaxHp, state.playerHp + finalHeal);
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → HP ${finalHeal} 回復`, "heal", state.elapsedMs),
  ];
  return { state: { ...state, playerHp: newHp }, logs };
});

registerEffectHandler("poison", ({ effectValue, effectTarget, cardDef, cardLevel, state, synergies }) => {
  // 毒はシンプルにダメージとして処理（DoT は tick で再呼び出しされる想定だが簡易版では即時）
  const baseDamage = Math.floor(effectValue * (1 + (cardLevel - 1) * 0.1));
  const multiplier = getDamageMultiplier(synergies, cardDef);
  const finalDamage = Math.floor(baseDamage * multiplier);
  const logs: BattleLogEntry[] = [];
  const newEnemies = [...state.enemies];

  const targets = effectTarget === "all_enemies"
    ? newEnemies.filter((e) => e.currentHp > 0)
    : [newEnemies.find((e) => e.currentHp > 0)].filter(Boolean);

  for (const target of targets) {
    if (!target) continue;
    const idx = newEnemies.findIndex((e) => e.id === target.id);
    newEnemies[idx] = { ...newEnemies[idx], currentHp: Math.max(0, newEnemies[idx].currentHp - finalDamage) };
    logs.push(createLog(`${cardDef.icon} ${cardDef.name} → ${target.name} に毒 ${finalDamage} ダメージ`, "damage", state.elapsedMs));
  }

  return { state: { ...state, enemies: newEnemies }, logs };
});

// バフ系は戦闘開始時に状態に反映する形（簡易実装）
registerEffectHandler("buff_attack", ({ cardDef, state }) => {
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → 攻撃力バフ発動`, "buff", state.elapsedMs),
  ];
  return { state, logs };
});

registerEffectHandler("buff_defense", ({ cardDef, state }) => {
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → 防御バフ発動`, "buff", state.elapsedMs),
  ];
  return { state, logs };
});

registerEffectHandler("regen", ({ effectValue, cardDef, state }) => {
  const newHp = Math.min(state.playerMaxHp, state.playerHp + effectValue);
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → リジェネ HP +${effectValue}`, "heal", state.elapsedMs),
  ];
  return { state: { ...state, playerHp: newHp }, logs };
});

registerEffectHandler("debuff_speed", ({ cardDef, state }) => {
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → 敵を減速`, "debuff", state.elapsedMs),
  ];
  return { state, logs };
});

registerEffectHandler("freeze", ({ effectValue, cardDef, state }) => {
  const logs: BattleLogEntry[] = [
    createLog(`${cardDef.icon} ${cardDef.name} → 敵を ${effectValue}ms 凍結`, "debuff", state.elapsedMs),
  ];
  // 凍結: 敵の攻撃クールダウンを増加
  const newEnemies = state.enemies.map((e) =>
    e.currentHp > 0
      ? { ...e, remainingAttackCooldownMs: e.remainingAttackCooldownMs + effectValue }
      : e,
  );
  return { state: { ...state, enemies: newEnemies }, logs };
});

// --------------- Core Battle Functions ---------------

/** バトル初期化 */
export function initBattle(
  deck: CardInstance[],
  enemies: Enemy[],
  playerHp: number,
): BattleState {
  const cardDefIds = deck.map((c) => c.definitionId);
  const activeSynergies = cardRegistry.evaluateSynergies(cardDefIds);

  const battleCards: BattleCard[] = deck.map((card) => {
    const def = cardRegistry.getCard(card.definitionId);
    const cooldownMultiplier = def ? getCooldownMultiplier(activeSynergies, def) : 1;
    const baseCooldown = (def?.cooldownSec ?? 3) * 1000;

    return {
      instanceId: card.instanceId,
      definitionId: card.definitionId,
      level: card.level,
      remainingCooldownMs: 0,
      activationCount: 0,
      hasActivatedOnStart: false,
    };
  });

  const enemiesWithCooldown: Enemy[] = enemies.map((e) => ({
    ...e,
    remainingAttackCooldownMs: e.attackCooldownMs,
  }));

  const state: BattleState = {
    isActive: true,
    elapsedMs: 0,
    playerHp,
    playerMaxHp: playerHp,
    enemies: enemiesWithCooldown,
    cards: battleCards,
    activeSynergies: activeSynergies.map((s) => s.id),
    log: [],
    result: "ongoing",
  };

  // シナジー発動ログ
  const synergyLogs: BattleLogEntry[] = activeSynergies.map((s) =>
    createLog(`✦ シナジー発動: ${s.name} - ${s.description}`, "synergy", 0),
  );

  // 戦闘開始時カード発動
  let currentState = { ...state, log: [...synergyLogs] };
  for (const battleCard of battleCards) {
    const def = cardRegistry.getCard(battleCard.definitionId);
    if (!def || def.timing !== "on_battle_start") continue;

    const result = applyCardEffects(def, battleCard, currentState, activeSynergies);
    currentState = result.state;
    currentState.log = [...currentState.log, ...result.logs];

    // mark as activated
    currentState.cards = currentState.cards.map((c) =>
      c.instanceId === battleCard.instanceId
        ? { ...c, hasActivatedOnStart: true, activationCount: c.activationCount + 1 }
        : c,
    );
  }

  return currentState;
}

/** カードの全効果を適用 */
function applyCardEffects(
  cardDef: CardDefinition,
  battleCard: BattleCard,
  state: BattleState,
  synergies: SynergyDefinition[],
): { state: BattleState; logs: BattleLogEntry[] } {
  let currentState = state;
  const allLogs: BattleLogEntry[] = [];

  for (const effect of cardDef.effects) {
    const handler = effectHandlers.get(effect.type);
    if (!handler) {
      allLogs.push(createLog(`⚠ 未知の効果: ${effect.type}`, "system", currentState.elapsedMs));
      continue;
    }

    const result = handler({
      effectType: effect.type,
      effectValue: effect.value,
      effectTarget: effect.target,
      effectParams: effect.params,
      cardDef,
      cardLevel: battleCard.level,
      state: currentState,
      synergies,
    });

    currentState = result.state;
    allLogs.push(...result.logs);
  }

  return { state: currentState, logs: allLogs };
}

/** バトル tick（deltaMs ミリ秒分進める） */
export function tickBattle(state: BattleState, deltaMs: number): BattleState {
  if (!state.isActive || state.result !== "ongoing") return state;

  let current: BattleState = {
    ...state,
    elapsedMs: state.elapsedMs + deltaMs,
    log: [], // この tick のログだけ返す
  };

  const synergies = current.activeSynergies
    .map((id) => cardRegistry.getSynergy(id))
    .filter(Boolean) as SynergyDefinition[];

  // 1. カードのクールダウン進行＆発動
  const newCards = [...current.cards];
  for (let i = 0; i < newCards.length; i++) {
    const battleCard = newCards[i];
    const def = cardRegistry.getCard(battleCard.definitionId);
    if (!def || def.timing !== "cooldown") continue;

    const cooldownMultiplier = getCooldownMultiplier(synergies, def);
    let remaining = battleCard.remainingCooldownMs - deltaMs;

    if (remaining <= 0) {
      // 発動
      const result = applyCardEffects(def, battleCard, current, synergies);
      current = result.state;
      current.log = [...current.log, ...result.logs];

      const baseCooldown = def.cooldownSec * 1000 * cooldownMultiplier;
      remaining = baseCooldown + remaining; // 余剰分を繰り越し

      newCards[i] = {
        ...battleCard,
        remainingCooldownMs: Math.max(0, remaining),
        activationCount: battleCard.activationCount + 1,
      };
    } else {
      newCards[i] = { ...battleCard, remainingCooldownMs: remaining };
    }
  }
  current = { ...current, cards: newCards };

  // 2. 敵の攻撃
  const newEnemies = [...current.enemies];
  for (let i = 0; i < newEnemies.length; i++) {
    const enemy = newEnemies[i];
    if (enemy.currentHp <= 0) continue;

    const remaining = enemy.remainingAttackCooldownMs - deltaMs;
    if (remaining <= 0) {
      // 防御バフチェック
      let damageReduction = 1;
      for (const card of current.cards) {
        const cDef = cardRegistry.getCard(card.definitionId);
        if (!cDef) continue;
        for (const eff of cDef.effects) {
          if (eff.type === "buff_defense" && card.hasActivatedOnStart) {
            damageReduction *= eff.value;
          }
        }
      }

      const finalDamage = Math.floor(enemy.attack * damageReduction);
      current = {
        ...current,
        playerHp: Math.max(0, current.playerHp - finalDamage),
      };
      current.log = [
        ...current.log,
        createLog(`${enemy.icon} ${enemy.name} → プレイヤーに ${finalDamage} ダメージ`, "damage", current.elapsedMs),
      ];

      newEnemies[i] = {
        ...enemy,
        remainingAttackCooldownMs: enemy.attackCooldownMs + remaining,
      };
    } else {
      newEnemies[i] = { ...enemy, remainingAttackCooldownMs: remaining };
    }
  }
  current = { ...current, enemies: newEnemies };

  // 3. 勝敗判定
  const allEnemiesDead = current.enemies.every((e) => e.currentHp <= 0);
  if (allEnemiesDead) {
    current = {
      ...current,
      isActive: false,
      result: "victory",
      log: [...current.log, createLog("🎉 勝利！", "system", current.elapsedMs)],
    };
  } else if (current.playerHp <= 0) {
    current = {
      ...current,
      isActive: false,
      result: "defeat",
      log: [...current.log, createLog("💀 敗北...", "system", current.elapsedMs)],
    };
  }

  return current;
}

/** 撃破した敵からドロップカードIDを取得 */
export function getDroppedCards(prevEnemies: Enemy[], newEnemies: Enemy[]): string[] {
  const drops: string[] = [];
  for (let i = 0; i < newEnemies.length; i++) {
    if (prevEnemies[i].currentHp > 0 && newEnemies[i].currentHp <= 0) {
      if (newEnemies[i].dropCardId) {
        drops.push(newEnemies[i].dropCardId as string);
      }
    }
  }
  return drops;
}
