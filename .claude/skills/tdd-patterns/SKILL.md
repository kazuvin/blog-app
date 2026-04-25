---
name: tdd-patterns
description: テスト駆動開発パターン。テストを仕様書として扱う。新しいコンポーネント/機能の作成時、テスト品質のレビュー時に使用。Red-Green-Refactorサイクルを徹底。
---

# TDDパターン

テスト駆動開発: **テスト = 仕様書**

## 基本ワークフロー

```
Red → Green → Refactor
 ↓       ↓        ↓
失敗   テストを  コードを
テスト  通す    整理
を書く
```

## テスト対象の選定（presentation.md と整合）

「テスト = 仕様書」は **仕様が非自明なもの** に適用する。構造的に明らかな UI primitive は Storybook で十分。

| 対象                                              | 戦略                                    |
| ------------------------------------------------- | --------------------------------------- |
| Pure presentation primitive（Button / Card 等）   | **Storybook で網羅**。`.test.tsx` は不要 |
| 状態 / イベント / a11y を持つ UI                  | **TDD で `.test.tsx`**                  |
| Hook / async / business logic                     | **TDD 必須**                            |
| Zustand store action                              | **TDD 必須**                            |
| 純粋関数 / formatter / parser                     | **TDD 必須**                            |

`<Button variant="primary">` のように構造的に明らかなものは story が仕様で十分。`useFilter` hook や `loginAction` のような **振る舞い** は TDD で先に仕様を固める。

## テスト構造（仕様書形式）

```typescript
describe("機能名", () => {
  // 1. セットアップと初期状態
  describe("初期状態", () => {
    it("エラーなくレンダリングされること", () => {});
    it("デフォルト値を持つこと", () => {});
  });

  // 2. コア機能
  describe("主要機能", () => {
    it("[条件]のとき[動作]すること", () => {});
  });

  // 3. ユーザー操作
  describe("ユーザー操作", () => {
    it("クリックイベントに反応すること", () => {});
    it("キーボード操作を処理すること", () => {});
  });

  // 4. エッジケースとエラー処理
  describe("エッジケース", () => {
    it("null/undefinedを適切に処理すること", () => {});
    it("API失敗時にエラーメッセージを表示すること", () => {});
  });
});
```

## 仕様チェックリスト

実装前に、テストで以下をカバーする必要がある:

| カテゴリ | 確認すべき内容 |
|----------|----------------|
| **Props/入力** | 何を受け取るか？デフォルト値は？ |
| **出力/表示** | 何を表示するか？ |
| **操作** | ユーザーはどう操作するか？ |
| **状態** | 状態はどう変化するか？ |
| **エラー** | 失敗時どうなるか？ |
| **アクセシビリティ** | キーボード/スクリーンリーダー対応か？ |

## リファレンス

- [component-tests.md](references/component-tests.md) - Reactコンポーネントのテストパターン
- [function-tests.md](references/function-tests.md) - 純粋関数のテストパターン
- [async-tests.md](references/async-tests.md) - 非同期/APIのテストパターン
