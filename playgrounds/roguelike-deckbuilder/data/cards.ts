// ============================================================
// カード定義データ
// 新しいカードはここに追加するだけでOK
// ============================================================

import type { CardDefinition } from "../engine/types";

export const STARTER_CARDS: CardDefinition[] = [
  // ---- 火属性 (fire) ----
  {
    id: "fire_slash",
    name: "ファイアスラッシュ",
    description: "炎を纏った斬撃を繰り出す",
    tags: ["fire", "attack", "melee"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 3,
    effects: [{ type: "damage", value: 15, target: "enemy" }],
    icon: "🔥",
  },
  {
    id: "flame_burst",
    name: "フレイムバースト",
    description: "戦闘開始時に全体炎ダメージ",
    tags: ["fire", "attack", "aoe"],
    rarity: "uncommon",
    timing: "on_battle_start",
    cooldownSec: 0,
    effects: [{ type: "damage", value: 25, target: "all_enemies" }],
    icon: "🌋",
  },
  {
    id: "fire_enchant",
    name: "ファイアエンチャント",
    description: "炎の加護で攻撃力を上昇させる",
    tags: ["fire", "buff"],
    rarity: "rare",
    timing: "on_battle_start",
    cooldownSec: 0,
    effects: [{ type: "buff_attack", value: 1.3, target: "self", params: { buffTag: "fire" } }],
    icon: "🔮",
  },

  // ---- 氷属性 (ice) ----
  {
    id: "ice_lance",
    name: "アイスランス",
    description: "氷の槍を投擲する",
    tags: ["ice", "attack", "ranged"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 4,
    effects: [{ type: "damage", value: 20, target: "enemy" }],
    icon: "🧊",
  },
  {
    id: "frost_armor",
    name: "フロストアーマー",
    description: "氷の鎧で防御力を上げる",
    tags: ["ice", "defense", "buff"],
    rarity: "uncommon",
    timing: "on_battle_start",
    cooldownSec: 0,
    effects: [{ type: "buff_defense", value: 0.8, target: "self" }],
    icon: "🛡️",
  },
  {
    id: "blizzard",
    name: "ブリザード",
    description: "吹雪で全敵にダメージ＋減速",
    tags: ["ice", "attack", "aoe", "debuff"],
    rarity: "rare",
    timing: "cooldown",
    cooldownSec: 8,
    effects: [
      { type: "damage", value: 30, target: "all_enemies" },
      { type: "debuff_speed", value: 1.5, target: "all_enemies", params: { durationMs: 3000 } },
    ],
    icon: "❄️",
  },

  // ---- 回復 (heal) ----
  {
    id: "heal_pulse",
    name: "ヒールパルス",
    description: "定期的にHPを回復する",
    tags: ["heal", "support"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 5,
    effects: [{ type: "heal", value: 10, target: "self" }],
    icon: "💚",
  },
  {
    id: "regen_aura",
    name: "リジェネオーラ",
    description: "戦闘開始時にリジェネを付与",
    tags: ["heal", "buff", "support"],
    rarity: "uncommon",
    timing: "on_battle_start",
    cooldownSec: 0,
    effects: [{ type: "regen", value: 3, target: "self", params: { intervalMs: 2000 } }],
    icon: "✨",
  },

  // ---- 雷属性 (lightning) ----
  {
    id: "thunder_bolt",
    name: "サンダーボルト",
    description: "高速で雷撃を放つ",
    tags: ["lightning", "attack", "ranged"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 2,
    effects: [{ type: "damage", value: 10, target: "enemy" }],
    icon: "⚡",
  },
  {
    id: "chain_lightning",
    name: "チェインライトニング",
    description: "雷が連鎖して全敵にダメージ",
    tags: ["lightning", "attack", "aoe"],
    rarity: "rare",
    timing: "cooldown",
    cooldownSec: 6,
    effects: [{ type: "damage", value: 18, target: "all_enemies" }],
    icon: "🌩️",
  },

  // ---- 毒 (poison) ----
  {
    id: "poison_dart",
    name: "ポイズンダート",
    description: "毒の飛針で継続ダメージ",
    tags: ["poison", "attack", "ranged", "dot"],
    rarity: "common",
    timing: "cooldown",
    cooldownSec: 4,
    effects: [{ type: "poison", value: 5, target: "enemy", params: { tickMs: 1000, durationMs: 5000 } }],
    icon: "🗡️",
  },

  // ---- レジェンダリー ----
  {
    id: "meteor_strike",
    name: "メテオストライク",
    description: "隕石を降らせ壊滅的ダメージ",
    tags: ["fire", "attack", "aoe"],
    rarity: "legendary",
    timing: "cooldown",
    cooldownSec: 15,
    effects: [{ type: "damage", value: 100, target: "all_enemies" }],
    icon: "☄️",
  },
  {
    id: "absolute_zero",
    name: "アブソリュートゼロ",
    description: "絶対零度で全敵を凍結",
    tags: ["ice", "attack", "aoe", "debuff"],
    rarity: "legendary",
    timing: "cooldown",
    cooldownSec: 20,
    effects: [
      { type: "damage", value: 60, target: "all_enemies" },
      { type: "freeze", value: 3000, target: "all_enemies" },
    ],
    icon: "💎",
  },
];
