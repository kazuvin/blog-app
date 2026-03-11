// ============================================================
// シナジー定義データ
// タグベースなので新しいカード種別追加時にシナジーも追加するだけ
// ============================================================

import type { SynergyDefinition } from "../engine/types";

export const SYNERGIES: SynergyDefinition[] = [
  {
    id: "fire_mastery",
    name: "炎の支配",
    description: "火属性カード3枚以上でダメージ1.5倍",
    conditions: [{ tag: "fire", minCount: 3 }],
    bonuses: [{ type: "damage_multiply", value: 1.5, targetTag: "fire" }],
  },
  {
    id: "ice_mastery",
    name: "氷の支配",
    description: "氷属性カード3枚以上でクールダウン20%短縮",
    conditions: [{ tag: "ice", minCount: 3 }],
    bonuses: [{ type: "cooldown_reduce", value: 0.8, targetTag: "ice" }],
  },
  {
    id: "elemental_fusion",
    name: "エレメンタルフュージョン",
    description: "火+氷カード各2枚以上で全ダメージ1.3倍",
    conditions: [
      { tag: "fire", minCount: 2 },
      { tag: "ice", minCount: 2 },
    ],
    bonuses: [{ type: "damage_multiply", value: 1.3 }],
  },
  {
    id: "healer_bond",
    name: "ヒーラーの絆",
    description: "回復カード2枚以上で回復量1.5倍",
    conditions: [{ tag: "heal", minCount: 2 }],
    bonuses: [{ type: "heal_multiply", value: 1.5 }],
  },
  {
    id: "storm_caller",
    name: "ストームコーラー",
    description: "雷+氷カード各2枚以上で雷ダメージ2倍",
    conditions: [
      { tag: "lightning", minCount: 2 },
      { tag: "ice", minCount: 2 },
    ],
    bonuses: [{ type: "damage_multiply", value: 2.0, targetTag: "lightning" }],
  },
  {
    id: "aoe_specialist",
    name: "範囲攻撃の達人",
    description: "AOEカード3枚以上で全体攻撃ダメージ1.4倍",
    conditions: [{ tag: "aoe", minCount: 3 }],
    bonuses: [{ type: "damage_multiply", value: 1.4, targetTag: "aoe" }],
  },
  {
    id: "poison_master",
    name: "毒の達人",
    description: "毒カード2枚以上+攻撃3枚以上で毒ダメージ2倍",
    conditions: [
      { tag: "poison", minCount: 2 },
      { tag: "attack", minCount: 3 },
    ],
    bonuses: [{ type: "damage_multiply", value: 2.0, targetTag: "poison" }],
  },
];
