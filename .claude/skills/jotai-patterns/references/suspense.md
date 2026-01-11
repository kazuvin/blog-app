# Suspense + Jotai Patterns

Reference: https://zenn.dev/uhyo/books/learn-react-with-jotai

## Core Concept

Jotaiの派生atomでPromiseを返すと、`useAtomValue`が内部で`use`を呼び出しサスペンドする。Promiseはatomにキャッシュされるため、Suspenseの要件（同じPromiseを渡す）を満たす。

```tsx
// 派生atomで非同期処理
const userAtom = atom(async (): Promise<User> => {
  const user = await fetchUser();
  return user;
});

// useAtomValueはPromiseをサスペンドして中身を返す
const UserProfile: React.FC = () => {
  const user: User = useAtomValue(userAtom); // User型（Promise<User>ではない）
  return <h1>{user.name}</h1>;
};

// 必ずSuspenseで囲む
const App: React.FC = () => (
  <Suspense fallback={<p>Loading...</p>}>
    <UserProfile />
  </Suspense>
);
```

## Pattern 1: Parameter via Atom

同時に1つのパラメータでしか非同期処理を行わない場合。

```tsx
// パラメータを保持するatom（private）
const userIdAtom = atom<string | null>(null);

// パラメータに依存する派生atom
const userAtom = atom(async (get): Promise<User | null> => {
  const userId = get(userIdAtom);
  if (userId === null) return null;

  const user = await fetchUser(userId);
  return user;
});

// パラメータ変更用のaction atom
export const setUserIdAtom = atom(null, (get, set, userId: string | null) =>
  set(userIdAtom, userId)
);

// Read-only export
export const userValueAtom = atom((get) => get(userAtom));
```

**ポイント**: `userIdAtom`を更新すると、依存する`userAtom`が自動的に再計算される。「非同期処理を実行せよ」ではなく「パラメータを変更する」という宣言的アプローチ。

## Pattern 2: Atom Factory (atomFamily)

同時に複数のパラメータで非同期処理を行う可能性がある場合。パラメータごとにキャッシュが分かれる。

```tsx
import { atomFamily } from "jotai-family";

// atomFamily: パラメータごとにatomを生成・キャッシュ
const userAtomFamily = atomFamily((userId: string) =>
  atom(async (): Promise<User> => {
    const user = await fetchUser(userId);
    return user;
  })
);

const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const userAtom = userAtomFamily(userId);
  const user: User = useAtomValue(userAtom);
  return <h1>{user.name}</h1>;
};
```

**手動実装の場合**:

```tsx
const createUserAtom = (userId: string) =>
  atom(async (): Promise<User> => {
    const user = await fetchUser(userId);
    return user;
  });

const userAtoms = new Map<string, ReturnType<typeof createUserAtom>>();

const getUserAtom = (userId: string) => {
  let userAtom = userAtoms.get(userId);
  if (!userAtom) {
    userAtom = createUserAtom(userId);
    userAtoms.set(userId, userAtom);
  }
  return userAtom;
};
```

## Pattern Comparison

| 観点              | Pattern 1 (Atom) | Pattern 2 (Factory)      |
| ----------------- | ---------------- | ------------------------ |
| キャッシュ        | 1つのみ          | パラメータごと           |
| user1→user2→user1 | 再fetch          | キャッシュヒット         |
| メモリ使用量      | 少ない           | パラメータ数に比例       |
| ユースケース      | 単一選択UI       | 複数表示、頻繁な切り替え |

## Memory Management Warning

atomFamilyやMapパターンでは、不要になったatomがメモリに残り続ける。

```tsx
// atomFamilyのタイムスタンプベース削除
const userAtomFamily = atomFamily((userId: string) => atom(async () => fetchUser(userId)), {
  // 5分間アクセスがなければ削除
  gcTime: 5 * 60 * 1000,
});

// 手動削除
userAtoms.delete(userId);
```

## Complete Example: Search Feature

```tsx
// src/features/search/stores/search-atoms.ts

// ============================================
// Private Atoms
// ============================================
const keywordAtom = atom("");

// ============================================
// Async Derived Atom (private)
// ============================================
const searchResultsInternalAtom = atom(async (get): Promise<Product[]> => {
  const keyword = get(keywordAtom);
  if (keyword === "") return [];

  const results = await searchProducts(keyword);
  return results;
});

// ============================================
// Read-Only Exports
// ============================================
export const keywordValueAtom = atom((get) => get(keywordAtom));
export const searchResultsAtom = atom((get) => get(searchResultsInternalAtom));

// ============================================
// Action Exports
// ============================================
export const setKeywordAtom = atom(null, (get, set, keyword: string) => set(keywordAtom, keyword));
```

Usage:

```tsx
const SearchBox: React.FC = () => {
  const setKeyword = useSetAtom(setKeywordAtom);

  return (
    <form action={(formData) => setKeyword(formData.get("keyword") as string)}>
      <input name="keyword" />
      <button type="submit">検索</button>
    </form>
  );
};

const SearchResults: React.FC = () => {
  const results = useAtomValue(searchResultsAtom);

  return (
    <ul>
      {results.map((p) => (
        <li key={p.id}>
          {p.name} - ¥{p.price}
        </li>
      ))}
    </ul>
  );
};

const App: React.FC = () => (
  <>
    <SearchBox />
    <Suspense fallback={<p>検索中...</p>}>
      <SearchResults />
    </Suspense>
  </>
);
```

## Key Insights from Reference

1. **UI = f(state)**: Suspenseにより非同期処理も「f」の中に組み込まれた
2. **宣言的アプローチ**: 「非同期処理を実行せよ」ではなく「パラメータを変更する」
3. **ステート数の削減**: 従来は「パラメータ」と「結果」が別々のステートだったが、Suspense + Jotaiでは「パラメータ」のみがステート
4. **Promiseをステートとして保持**: 従来のReactにはなかった発想。Jotaiはこれにマッチした設計
