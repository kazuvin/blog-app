// ============================================================
// Roguelike Deck Builder - Core Types
// Framework-agnostic types (no React dependency)
// ============================================================

// --------------- Card System ---------------

/** カードの発動タイミング */
export type ActivationTiming = "on_battle_start" | "cooldown";

/** カード効果の種別（無限にスケール可能） */
export type EffectType = string;

/** カード効果 */
export interface CardEffect {
  type: EffectType;
  /** 効果値（ダメージ量、回復量、バフ倍率など） */
  value: number;
  /** 効果対象 */
  target: "enemy" | "self" | "all_enemies";
  /** 追加パラメータ（効果タイプごとに自由に拡張） */
  params?: Record<string, unknown>;
}

/** カード定義（テンプレート） */
export interface CardDefinition {
  id: string;
  name: string;
  description: string;
  /** カードの種別タグ（シナジー判定に使用、複数可） */
  tags: string[];
  /** レアリティ */
  rarity: "common" | "uncommon" | "rare" | "legendary";
  /** 発動タイミング */
  timing: ActivationTiming;
  /** クールダウン（秒）。timing=cooldown 時のみ使用 */
  cooldownSec: number;
  /** 効果リスト */
  effects: CardEffect[];
  /** アイコン（emoji or URL） */
  icon: string;
}

/** プレイヤーが所持するカードインスタンス */
export interface CardInstance {
  instanceId: string;
  definitionId: string;
  /** 強化レベル */
  level: number;
}

// --------------- Synergy System ---------------

/** シナジー条件 */
export interface SynergyCondition {
  /** 必要なタグ */
  tag: string;
  /** 必要枚数 */
  minCount: number;
}

/** シナジー定義 */
export interface SynergyDefinition {
  id: string;
  name: string;
  description: string;
  /** 発動条件（すべて満たす必要あり） */
  conditions: SynergyCondition[];
  /** シナジーボーナス効果 */
  bonuses: SynergyBonus[];
}

/** シナジーボーナス */
export interface SynergyBonus {
  /** ボーナス種別 */
  type: "damage_multiply" | "cooldown_reduce" | "heal_multiply" | "extra_effect" | string;
  /** ボーナス値 */
  value: number;
  /** 対象タグ（省略時は全カード） */
  targetTag?: string;
}

// --------------- Battle System ---------------

/** バトル中のカード状態 */
export interface BattleCard {
  instanceId: string;
  definitionId: string;
  level: number;
  /** 次回発動までの残り時間（ms） */
  remainingCooldownMs: number;
  /** 発動回数 */
  activationCount: number;
  /** 戦闘開始時発動済みか */
  hasActivatedOnStart: boolean;
}

/** 敵データ */
export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  /** 攻撃クールダウン（ms） */
  attackCooldownMs: number;
  /** 次回攻撃までの残り時間（ms） */
  remainingAttackCooldownMs: number;
  /** ドロップするカード定義ID（nullならドロップなし） */
  dropCardId: string | null;
  icon: string;
}

/** バトルログエントリ */
export interface BattleLogEntry {
  timestamp: number;
  message: string;
  type: "damage" | "heal" | "buff" | "debuff" | "system" | "synergy";
}

/** バトル状態 */
export interface BattleState {
  /** バトル進行中か */
  isActive: boolean;
  /** 経過時間（ms） */
  elapsedMs: number;
  /** プレイヤーHP */
  playerHp: number;
  playerMaxHp: number;
  /** 敵リスト */
  enemies: Enemy[];
  /** デッキ内のカード状態 */
  cards: BattleCard[];
  /** 発動中のシナジー */
  activeSynergies: string[];
  /** バトルログ */
  log: BattleLogEntry[];
  /** バトル結果 */
  result: "ongoing" | "victory" | "defeat";
}

// --------------- Tower / Progression ---------------

/** タワーフロア定義 */
export interface FloorDefinition {
  floorNumber: number;
  enemies: Omit<Enemy, "remainingAttackCooldownMs">[];
}

/** ガチャ結果 */
export interface GachaResult {
  cardDefinitionId: string;
  isNew: boolean;
}

// --------------- Game State (Store shape) ---------------

export interface GameState {
  /** 現在のフロア番号 */
  currentFloor: number;
  /** 最高到達フロア */
  highestFloor: number;
  /** 所持カード */
  ownedCards: CardInstance[];
  /** デッキ（バトルに使うカードのinstanceId） */
  deck: string[];
  /** 最大デッキサイズ */
  maxDeckSize: number;
  /** プレイヤー基礎HP */
  basePlayerHp: number;
  /** ゴールド */
  gold: number;
  /** バトル状態 */
  battle: BattleState;
}
