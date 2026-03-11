"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initializeGameData } from "../data/init";
import { cardRegistry } from "../engine/card-registry";
import { useGameStore } from "../engine/store";
import type { BattleLogEntry, CardDefinition, CardInstance } from "../engine/types";

// Initialize game data
initializeGameData();

// --------------- Sub Components ---------------

function CardDisplay({
  card,
  def,
  inDeck,
  onToggleDeck,
}: {
  card: CardInstance;
  def: CardDefinition;
  inDeck: boolean;
  onToggleDeck: () => void;
}) {
  const rarityColors: Record<string, string> = {
    common: "border-gray-400",
    uncommon: "border-green-400",
    rare: "border-blue-400",
    legendary: "border-yellow-400",
  };

  return (
    <div
      className={`rounded-lg border-2 p-3 ${rarityColors[def.rarity] ?? "border-gray-400"} ${inDeck ? "bg-blue-900/30" : "bg-gray-800/50"} cursor-pointer transition-colors hover:bg-gray-700/50`}
      onClick={onToggleDeck}
      onKeyDown={(e) => e.key === "Enter" && onToggleDeck()}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{def.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-sm">{def.name}</div>
          <div className="text-foreground/60 text-xs">{def.description}</div>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        <span className="rounded bg-gray-700 px-1">Lv.{card.level}</span>
        <span className="rounded bg-gray-700 px-1">
          {def.timing === "on_battle_start" ? "開戦時" : `CD ${def.cooldownSec}s`}
        </span>
        {def.tags.map((tag) => (
          <span key={tag} className="rounded bg-gray-600 px-1">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-1 text-right text-xs">
        {inDeck ? "✅ デッキ内" : "タップでデッキに追加"}
      </div>
    </div>
  );
}

function BattleView() {
  const battle = useGameStore((s) => s.battle);
  const tickBattle = useGameStore((s) => s.tickBattle);
  const endBattle = useGameStore((s) => s.endBattle);
  const advanceFloor = useGameStore((s) => s.advanceFloor);
  const currentFloor = useGameStore((s) => s.currentFloor);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [recentLogs, setRecentLogs] = useState<BattleLogEntry[]>([]);

  useEffect(() => {
    if (battle.isActive && battle.result === "ongoing") {
      intervalRef.current = setInterval(() => {
        const logs = tickBattle(200);
        if (logs.length > 0) {
          setRecentLogs((prev) => [...prev, ...logs].slice(-50));
        }
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [battle.isActive, battle.result, tickBattle]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [recentLogs]);

  if (!battle.isActive && battle.result === "ongoing") {
    return null;
  }

  const handleEndBattle = () => {
    if (battle.result === "victory") {
      advanceFloor();
    }
    endBattle();
    setRecentLogs([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">
          Floor {currentFloor} -{" "}
          {battle.result === "ongoing"
            ? "戦闘中..."
            : battle.result === "victory"
              ? "🎉 勝利！"
              : "💀 敗北..."}
        </h3>
        <span className="text-sm">
          {(battle.elapsedMs / 1000).toFixed(1)}s
        </span>
      </div>

      {/* Player HP */}
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Player HP</span>
          <span>
            {battle.playerHp} / {battle.playerMaxHp}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${(battle.playerHp / battle.playerMaxHp) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Enemies */}
      <div className="grid grid-cols-2 gap-2">
        {battle.enemies.map((enemy) => (
          <div
            key={enemy.id}
            className={`rounded-lg border p-2 ${enemy.currentHp <= 0 ? "border-gray-700 opacity-40" : "border-red-800"}`}
          >
            <div className="flex items-center gap-1">
              <span className="text-xl">{enemy.icon}</span>
              <span className="truncate font-bold text-sm">{enemy.name}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${Math.max(0, (enemy.currentHp / enemy.maxHp) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-0.5 text-right text-xs">
              {Math.max(0, enemy.currentHp)} / {enemy.maxHp}
            </div>
          </div>
        ))}
      </div>

      {/* Active Synergies */}
      {battle.activeSynergies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {battle.activeSynergies.map((id) => {
            const syn = cardRegistry.getSynergy(id);
            return (
              <span
                key={id}
                className="rounded-full bg-purple-800 px-2 py-0.5 text-xs"
                title={syn?.description}
              >
                ✦ {syn?.name ?? id}
              </span>
            );
          })}
        </div>
      )}

      {/* Cards cooldown */}
      <div className="grid grid-cols-3 gap-1">
        {battle.cards.map((bc) => {
          const def = cardRegistry.getCard(bc.definitionId);
          if (!def) return null;
          const cdPercent =
            def.timing === "cooldown" && def.cooldownSec > 0
              ? Math.max(
                  0,
                  (1 - bc.remainingCooldownMs / (def.cooldownSec * 1000)) * 100,
                )
              : 100;
          return (
            <div key={bc.instanceId} className="rounded border border-gray-600 p-1 text-center">
              <div className="text-lg">{def.icon}</div>
              <div className="truncate text-xs">{def.name}</div>
              {def.timing === "cooldown" && (
                <div className="mx-auto mt-0.5 h-1 w-full overflow-hidden rounded bg-gray-700">
                  <div
                    className="h-full rounded bg-cyan-400 transition-all"
                    style={{ width: `${cdPercent}%` }}
                  />
                </div>
              )}
              <div className="text-[10px] text-foreground/50">x{bc.activationCount}</div>
            </div>
          );
        })}
      </div>

      {/* Battle Log */}
      <div className="h-40 overflow-y-auto rounded border border-gray-700 bg-black/30 p-2 font-mono text-xs">
        {recentLogs.map((log, i) => {
          const colorMap: Record<string, string> = {
            damage: "text-red-400",
            heal: "text-green-400",
            buff: "text-blue-400",
            debuff: "text-orange-400",
            system: "text-yellow-400",
            synergy: "text-purple-400",
          };
          return (
            <div key={`${log.timestamp}-${i}`} className={colorMap[log.type] ?? ""}>
              [{(log.timestamp / 1000).toFixed(1)}s] {log.message}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      {/* End battle button */}
      {battle.result !== "ongoing" && (
        <button
          type="button"
          onClick={handleEndBattle}
          className="w-full rounded-lg bg-blue-600 py-2 font-bold transition-colors hover:bg-blue-500"
        >
          {battle.result === "victory"
            ? "次のフロアへ進む"
            : "リトライ（デッキ編集へ）"}
        </button>
      )}
    </div>
  );
}

// --------------- Main Component ---------------

export default function RoguelikeGame() {
  const ownedCards = useGameStore((s) => s.ownedCards);
  const deck = useGameStore((s) => s.deck);
  const maxDeckSize = useGameStore((s) => s.maxDeckSize);
  const currentFloor = useGameStore((s) => s.currentFloor);
  const highestFloor = useGameStore((s) => s.highestFloor);
  const gold = useGameStore((s) => s.gold);
  const battle = useGameStore((s) => s.battle);
  const addCardToOwned = useGameStore((s) => s.addCardToOwned);
  const addToDeck = useGameStore((s) => s.addToDeck);
  const removeFromDeck = useGameStore((s) => s.removeFromDeck);
  const startBattle = useGameStore((s) => s.startBattle);
  const pullGacha = useGameStore((s) => s.pullGacha);
  const resetGame = useGameStore((s) => s.resetGame);

  const [gachaResult, setGachaResult] = useState<string | null>(null);
  const [view, setView] = useState<"deck" | "battle">("deck");

  // 初回: スターターカード付与
  useEffect(() => {
    if (ownedCards.length === 0) {
      addCardToOwned("fire_slash");
      addCardToOwned("ice_lance");
      addCardToOwned("heal_pulse");
      addCardToOwned("thunder_bolt");
    }
  }, [ownedCards.length, addCardToOwned]);

  const handleToggleDeck = useCallback(
    (instanceId: string) => {
      if (deck.includes(instanceId)) {
        removeFromDeck(instanceId);
      } else {
        addToDeck(instanceId);
      }
    },
    [deck, addToDeck, removeFromDeck],
  );

  const handleStartBattle = () => {
    if (deck.length === 0) return;
    startBattle();
    setView("battle");
  };

  const handleGacha = () => {
    const result = pullGacha();
    const def = cardRegistry.getCard(result.cardDefinitionId);
    setGachaResult(
      `${def?.icon ?? "?"} ${def?.name ?? result.cardDefinitionId} ${result.isNew ? "(NEW!)" : "(dup)"}`,
    );
    setTimeout(() => setGachaResult(null), 3000);
  };

  const isBattleActive = battle.isActive || battle.result !== "ongoing";

  // Auto-switch view
  useEffect(() => {
    if (!battle.isActive && battle.result === "ongoing") {
      setView("deck");
    }
  }, [battle.isActive, battle.result]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm">
            Floor {currentFloor} | Best: {highestFloor} | Gold: {gold}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView(view === "deck" ? "battle" : "deck")}
            className="rounded border border-gray-600 px-3 py-1 text-sm transition-colors hover:bg-gray-700"
            disabled={!isBattleActive && view === "battle"}
          >
            {view === "deck" ? "バトル" : "デッキ"}
          </button>
          <button
            type="button"
            onClick={resetGame}
            className="rounded border border-red-800 px-3 py-1 text-red-400 text-sm transition-colors hover:bg-red-900/30"
          >
            リセット
          </button>
        </div>
      </div>

      {/* Battle View */}
      {view === "battle" && isBattleActive && <BattleView />}

      {/* Deck View */}
      {view === "deck" && (
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleStartBattle}
              disabled={deck.length === 0}
              className="flex-1 rounded-lg bg-green-700 py-2 font-bold transition-colors hover:bg-green-600 disabled:opacity-40"
            >
              バトル開始 (Floor {currentFloor})
            </button>
            <button
              type="button"
              onClick={handleGacha}
              className="rounded-lg bg-purple-700 px-4 py-2 font-bold transition-colors hover:bg-purple-600"
            >
              ガチャ
            </button>
          </div>

          {/* Gacha result */}
          {gachaResult && (
            <div className="rounded-lg border border-purple-500 bg-purple-900/30 p-3 text-center">
              {gachaResult}
            </div>
          )}

          {/* Deck info */}
          <div className="text-sm">
            デッキ: {deck.length} / {maxDeckSize}
          </div>

          {/* Synergy preview */}
          {deck.length > 0 && (
            <div>
              <div className="mb-1 font-bold text-sm">発動シナジー:</div>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const defIds = deck
                    .map((id) => ownedCards.find((c) => c.instanceId === id))
                    .filter(Boolean)
                    .map((c) => c!.definitionId);
                  const synergies = cardRegistry.evaluateSynergies(defIds);
                  if (synergies.length === 0)
                    return (
                      <span className="text-foreground/50 text-xs">
                        なし（タグが一致するカードを集めよう）
                      </span>
                    );
                  return synergies.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full bg-purple-800 px-2 py-0.5 text-xs"
                      title={s.description}
                    >
                      ✦ {s.name}
                    </span>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Card list */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ownedCards.map((card) => {
              const def = cardRegistry.getCard(card.definitionId);
              if (!def) return null;
              return (
                <CardDisplay
                  key={card.instanceId}
                  card={card}
                  def={def}
                  inDeck={deck.includes(card.instanceId)}
                  onToggleDeck={() => handleToggleDeck(card.instanceId)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
