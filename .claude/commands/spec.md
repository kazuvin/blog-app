---
description: "Feature 実装前に SPEC.md を対話で固める。実装は別 session で fresh context から始めることを推奨（spec-first / build-second 分離）。"
argument-hint: "<feature-name>"
disable-model-invocation: true
---

# /spec

**目的**: 実装着手前に要件・受入条件・テストケースを `docs/specs/<feature-name>.md` に書き出す。これを「次の fresh session」で実装する前提で動く分離パターン。

**なぜ session を分けるか**: 要件定義と実装を同じ context で行うと、途中決定の発散や初期仮説への引きずられが起きる。仕様を文書化して別 session に渡すことで、実装 session は「仕様 vs コード」の直交チェックができる。

## 入力

```
$ARGUMENTS
```

（空なら user に feature 名を質問）

## フロー

### 0. 先行ドキュメント・コード調査

以下を **並列で** Read / Grep する:

- `src/features/` 配下で類似 feature があるか
- `src/components/ui/` で使える primitive があるか
- `src/app/globals.css` の @theme で使える token があるか
- 既存 `docs/specs/*.md` で用語・パターンの前例があるか

結果は user に共有し、以降の質問で使い回す。

### 1. 対話で埋める項目

以下を **user に質問しながら** 決めていく。仮説は user に確認してから採用。

1. **Intent**: 1 行で「誰が・何を・何のために」
2. **User-visible behavior**: 見える挙動を箇条書き（URL / 画面遷移 / 空状態 / エラー表示）
3. **Acceptance criteria**: Given-When-Then 形式で 3–7 個
4. **Out of scope**: 今回やらない範囲（将来宿題も含め明示）
5. **Data / state**:
   - サーバ state（Next.js data source / fetch 場所）
   - クライアント state（Zustand store が必要か、既存 store 拡張か）
   - URL params が関わるか
6. **Components to build / touch**:
   - Presentation or Container? （component-creator の Decision Guide）
   - 新規 primitive が必要か（新規なら `@theme` token 追加も必要か）
7. **Test strategy**（TDD 前提, tdd-patterns skill 準拠）:
   - Vitest で何を spec にするか（観測可能な behavior）
   - Storybook story が必要な variant
   - E2E が必要な critical path
8. **Accessibility checkpoints**: keyboard trap / focus order / ARIA
9. **Risks / open questions**: 未解決事項、調査が必要なもの

### 2. 成果物

`docs/specs/<feature-name>.md` を以下のテンプレで出力:

```md
# Spec: {Feature Name}

**Status**: draft · **Owner**: {author} · **Created**: {YYYY-MM-DD}

## Intent
{1 行}

## User-visible behavior
- ...

## Acceptance criteria
- **Given** ... **When** ... **Then** ...
- ...

## Out of scope
- ...

## Data / state
- Server: ...
- Client (Zustand): ...
- URL params: ...

## Components
| Layer | New or existing | Path |
|---|---|---|
| Presentation | ... | `src/components/ui/...` |
| Container | ... | `src/features/.../` |

## Test strategy
- Vitest specs:
  - ...
- Stories:
  - ...
- E2E:
  - ...

## Accessibility
- ...

## Risks / open questions
- ...

## Implementation hand-off
次の session で以下を fresh context から実行:

1. この spec を Read
2. `tdd-patterns` skill に従い Vitest spec を先に書く（Acceptance criteria を 1 対 1 でマップ）
3. `component-creator` skill で実装
4. `ci-check` で完了判定

Subagent 起動推奨: `react-component-builder`（skills 自動 inject される）
```

### 3. 完了時の挙動

- `docs/specs/<feature-name>.md` を保存
- user に「実装は `/clear` して新 session で着手してください」と案内
- worktree を使う場合は `/task` に流す選択肢も提示

## やらないこと

- この command 内で実装に着手しない（spec が目的、実装は別 session）
- 既存 spec の履歴を消さない（同名があれば上書き確認、`-vN` サフィックスで派生を推奨）
- `ci-check` は実装側の責任なのでここでは走らせない
