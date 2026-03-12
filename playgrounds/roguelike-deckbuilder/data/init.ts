// ============================================================
// カード＆シナジーの初期登録
// アプリ起動時に1回呼ぶ
// ============================================================

import { cardRegistry } from "../engine/card-registry";
import { STARTER_CARDS } from "./cards";
import { SYNERGIES } from "./synergies";

let initialized = false;

export function initializeGameData(): void {
  if (initialized) return;
  cardRegistry.registerCards(STARTER_CARDS);
  cardRegistry.registerSynergies(SYNERGIES);
  initialized = true;
}
