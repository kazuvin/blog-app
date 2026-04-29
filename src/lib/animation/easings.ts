/**
 * Easing tuples for use with `motion/react` `transition.ease`.
 *
 * SSoT pair: `src/app/globals.css` の `@theme` block にある
 * `--ease-default` / `--ease-spring` と同じ cubic-bezier 値を保持する。
 * CSS 側を変更したら必ずこちらも合わせること（drift 検知のため値はハードコード）。
 */

/** Mirrors `--ease-default: cubic-bezier(0.25, 0.46, 0.45, 0.94)` */
export const EASE_DEFAULT = [0.25, 0.46, 0.45, 0.94] as const;

/** Mirrors `--ease-spring: cubic-bezier(0.34, 1.46, 0.74, 1)` */
export const EASE_SPRING = [0.34, 1.46, 0.74, 1] as const;
