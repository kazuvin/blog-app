---
name: ci-check
description: タスク完了前に必ず実行するCIチェック一式。Biome Lint/Format・TypeScript型チェック・Vitestテストを順番に実行し、すべて成功することを保証する。コード変更を伴う作業の仕上げとして使用する。
---

# ci-check

タスクを「完了」と宣言する前に、このSKILLに従って必ずローカルCIを通してください。

## 必須コマンド

以下を **上から順に** 実行し、**すべて成功** することを確認する。失敗した場合はタスクは未完了です。

| # | コマンド | 目的 | 失敗時の扱い |
|---|---------|------|-------------|
| 1 | `pnpm lint` | Biome Linter + Formatter チェック（error があれば失敗） | 修正必須。`pnpm lint:fix` で自動修正できる箇所は適用する |
| 2 | `pnpm tsc --noEmit` | TypeScript 型チェック（`pnpm build` の代替として高速） | 型エラーは根本修正。`any` / `@ts-ignore` で逃げない |
| 3 | `pnpm test:run` | Vitest を 1 回実行（変更に関連するテストが成功すること） | 失敗したテストは原因を調査し修正。無関係に見えても skip しない |

## 判定ルール

- すべて exit code 0 → タスク完了可
- 1つでも exit code ≠ 0 → **タスク未完了**。ユーザーに完了報告してはいけない
- warning は許容（ただし新規に追加した warning は極力解消する）

## 典型的な失敗パターンと対処

| 症状 | 原因 | 対処 |
|------|------|------|
| `lint/style/useFilenamingConvention` | ファイル名が kebab-case でない | ファイル名を修正 |
| `lint/style/useImportType` | 型のみのimportに `type` が無い | `import type { ... }` に変更 |
| `lint/a11y/...` | アクセシビリティ違反 | 対応属性を追加（`alt` / `aria-*` / `htmlFor` 等） |
| `lint/correctness/useExhaustiveDependencies` | useEffect/useMemo の依存配列漏れ | 依存を追加、または意図的な場合はコメントで根拠を明示 |
| `lint/nursery/useSortedClasses` | Tailwind クラス順序 | `pnpm lint:fix` で自動整列 |
| 型エラー `Property 'x' does not exist` | 型定義とのズレ | 型定義を更新、`as` キャストは最終手段 |

## 自動修正ワークフロー

可能な限り自動で直す:

```bash
pnpm lint:fix   # Biome の safe fix を適用（クラス整列・import 整理など）
pnpm format     # Biome formatter を上書き実行
```

その後 `pnpm lint` を再実行して残存 error が無いことを確認する。

## 省略可能なケース

以下の場合のみスキップしてよい（ユーザーに明示）:

- ドキュメント (`*.md`) のみの変更で、コード/設定に一切触っていない
- コメントのみの変更（挙動が変わらないことを目視確認済み）
- 設定ファイルの検討フェーズで、まだ実装に反映していない

それ以外は **必ず** 上記3コマンドを走らせる。

## 参考: package.json の関連スクリプト

- `pnpm lint` → `biome check`
- `pnpm lint:fix` → `biome check --write`
- `pnpm format` → `biome format --write`
- `pnpm test:run` → `vitest run`
- `pnpm test:coverage` → `vitest run --coverage`（カバレッジ閾値90%）
