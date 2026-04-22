/**
 * テストで「この配列/マップ要素は存在するはず」という局所的な非nullアサーション用のヘルパ。
 * tsconfig の noUncheckedIndexedAccess により `arr[i]` は `T | undefined` となるため、
 * テスト内で既知のインデックスを読む場面ではこの関数で undefined を排除する。
 */
export function getDefined<T>(value: T | undefined, message = "Expected value to be defined"): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}
