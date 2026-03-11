// ============================================================
// フロア生成ロジック
// 無限タワーなのでフロア番号から動的に生成
// ============================================================

import type { Enemy, FloorDefinition } from "../engine/types";
import { STARTER_CARDS } from "./cards";

/** 簡易擬似乱数（シード付き） */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const ENEMY_TEMPLATES: Omit<Enemy, "currentHp" | "remainingAttackCooldownMs" | "maxHp" | "attack" | "attackCooldownMs">[] = [
  { id: "slime", name: "スライム", dropCardId: null, icon: "🟢" },
  { id: "goblin", name: "ゴブリン", dropCardId: null, icon: "👺" },
  { id: "skeleton", name: "スケルトン", dropCardId: null, icon: "💀" },
  { id: "bat", name: "コウモリ", dropCardId: null, icon: "🦇" },
  { id: "wolf", name: "ウルフ", dropCardId: null, icon: "🐺" },
  { id: "golem", name: "ゴーレム", dropCardId: null, icon: "🗿" },
  { id: "dragon", name: "ドラゴン", dropCardId: null, icon: "🐉" },
  { id: "demon", name: "デーモン", dropCardId: null, icon: "👿" },
];

/** フロア番号からフロアを動的に生成 */
export function generateFloor(floorNumber: number): FloorDefinition {
  const rng = seededRandom(floorNumber * 7919);

  // フロアが上がるほど敵が強く多くなる
  const enemyCount = Math.min(1 + Math.floor(floorNumber / 5), 4);
  const hpScale = 1 + floorNumber * 0.3;
  const atkScale = 1 + floorNumber * 0.15;

  // ボスフロア（10階ごと）
  const isBossFloor = floorNumber % 10 === 0;

  const droppableCards = STARTER_CARDS.filter((c) => c.rarity !== "legendary");

  const enemies: Omit<Enemy, "remainingAttackCooldownMs">[] = [];

  if (isBossFloor) {
    // ボスは1体だけ、強力
    const bossTemplate = ENEMY_TEMPLATES[Math.floor(rng() * ENEMY_TEMPLATES.length)];
    const bossHp = Math.floor(80 * hpScale * 2);
    const dropCard = droppableCards[Math.floor(rng() * droppableCards.length)];
    enemies.push({
      ...bossTemplate,
      id: `${bossTemplate.id}_boss_f${floorNumber}`,
      name: `${bossTemplate.name}・ボス`,
      maxHp: bossHp,
      currentHp: bossHp,
      attack: Math.floor(12 * atkScale * 1.5),
      attackCooldownMs: 2500,
      dropCardId: dropCard.id,
    });
  } else {
    for (let i = 0; i < enemyCount; i++) {
      const template = ENEMY_TEMPLATES[Math.floor(rng() * ENEMY_TEMPLATES.length)];
      const hp = Math.floor((30 + rng() * 20) * hpScale);
      const shouldDrop = rng() > 0.7;
      const dropCard = shouldDrop
        ? droppableCards[Math.floor(rng() * droppableCards.length)]
        : null;

      enemies.push({
        ...template,
        id: `${template.id}_f${floorNumber}_${i}`,
        maxHp: hp,
        currentHp: hp,
        attack: Math.floor((5 + rng() * 5) * atkScale),
        attackCooldownMs: 2000 + Math.floor(rng() * 2000),
        dropCardId: dropCard?.id ?? null,
      });
    }
  }

  return { floorNumber, enemies };
}
